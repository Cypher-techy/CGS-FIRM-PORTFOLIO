import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
test("Schema, seeds, CRUD, privacy and the five-role permission matrix", async () => {
  const db = new PGlite({ extensions: { pgcrypto } });
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(bucket_id text);grant usage on schema auth to anon,authenticated;alter default privileges in schema public grant select,insert,update,delete on tables to anon,authenticated,service_role;`,
    );
    await db.exec(await readFile("supabase/schema.sql", "utf8"));
    const seed = await readFile("supabase/seed.sql", "utf8");
    await db.exec(seed);
    await db.exec(seed);
    assert.equal(
      (await db.query("select count(*) as n from products")).rows[0].n,
      4,
    );
    const matrix = {
        editor: ["publications", "media_assets"],
        project_manager: [
          "projects",
          "case_studies",
          "partnerships",
          "media_assets",
        ],
        content_manager: [
          "business_divisions",
          "services",
          "products",
          "projects",
          "case_studies",
          "industries",
          "publications",
          "careers",
          "media_assets",
        ],
        administrator: ["all-except-profiles"],
        super_admin: ["all"],
      },
      resources = [
        "profiles",
        "business_divisions",
        "services",
        "products",
        "projects",
        "case_studies",
        "industries",
        "publications",
        "careers",
        "applications",
        "inquiries",
        "partnerships",
        "media_assets",
        "website_settings",
        "audit_logs",
      ];
    let i = 0;
    for (const [role, allowed] of Object.entries(matrix)) {
      await db.exec("reset role");
      const id = `30000000-0000-4000-8000-00000000000${++i}`;
      await db.query("insert into auth.users values($1)", [id]);
      await db.query("insert into profiles(id,email,role) values($1,$2,$3)", [
        id,
        `${role}@example.test`,
        role,
      ]);
      await db.exec(`set role authenticated;set request.jwt.claim.sub='${id}'`);
      for (const r of resources) {
        const actual = (await db.query("select can_manage($1) ok", [r])).rows[0]
          .ok;
        assert.equal(
          actual,
          role === "super_admin" ||
            (role === "administrator" && r !== "profiles") ||
            allowed.includes(r),
          `${role} -> ${r}`,
        );
      }
      if (role === "super_admin") {
        for (const [table, values] of Object.entries({
          business_divisions: "slug,name",
          industries: "slug,name",
          services: "slug,title",
          products: "slug,name",
          projects: "slug,name",
          careers: "slug,title",
          publications: "slug,title",
          project_categories: "slug,name",
        })) {
          const row = (
            await db.query(
              `insert into ${table}(${values},published) values('workflow-test','Workflow',false) returning id`,
            )
          ).rows[0];
          await db.query(`update ${table} set published=true where id=$1`, [
            row.id,
          ]);
          await db.query(`update ${table} set published=false where id=$1`, [
            row.id,
          ]);
          await db.query(`delete from ${table} where id=$1`, [row.id]);
        }
        await db.exec(
          "insert into case_studies(title,body)values('Case','Public story');update case_studies set published=true where title='Case';delete from case_studies where title='Case';insert into media_assets(name,url)values('Approved image','https://example.test/file.png');delete from media_assets where name='Approved image';",
        );
      }
      if (role === "editor") {
        assert.equal(
          (
            await db.query(
              "update profiles set role='super_admin' where id=auth.uid() returning id",
            )
          ).rows.length,
          0,
        );
        await db.exec(
          "insert into publications(slug,title,published)values('draft','Draft',false);update publications set title='Draft revision' where slug='draft';",
        );
        await assert.rejects(
          db.exec(
            "insert into products(slug,name) values('forbidden','Forbidden')",
          ),
        );
      }
      if (role === "administrator") {
        await db.exec(
          "insert into website_settings(key,value)values('site_title','\"CGS\"');update website_settings set value='\"Updated\"' where key='site_title';delete from website_settings where key='site_title';",
        );
        assert.equal(
          (
            await db.query(
              "select * from audit_logs where entity='website_settings'",
            )
          ).rows.length,
          3,
        );
      }
    }
    await db.exec("reset role;set request.jwt.claim.sub='';set role anon");
    assert.equal(
      (await db.query("select * from publications where slug='draft'")).rows
        .length,
      0,
    );
    await assert.rejects(
      db.exec(
        "insert into inquiries(name,email,message)values('Test','a@example.test','test')",
      ),
    );
    assert.equal((await db.query("select * from profiles")).rows.length, 0);
    await db.exec("reset role;set role service_role");
    await db.exec(
      "insert into inquiries(name,email,message)values('Test','a@example.test','test')",
    );
    assert.equal(
      (await db.query("select take_form_slot('test',1) ok")).rows[0].ok,
      true,
    );
    assert.equal(
      (await db.query("select take_form_slot('test',1) ok")).rows[0].ok,
      false,
    );
    await db.exec(
      "insert into partnerships(organisation,contact_name,email,proposal)values('Fixture','Test','a@example.test','Proposal');insert into applications(applicant_name,email,career_title)values('Test','a@example.test','Local vacancy');reset role;set role authenticated;set request.jwt.claim.sub='30000000-0000-4000-8000-000000000004';",
    );
    for (const t of ["applications", "inquiries", "partnerships"]) {
      assert.equal(
        (await db.query(`update ${t} set status='In Review' returning status`))
          .rows[0].status,
        "In Review",
      );
      await db.exec(`delete from ${t}`);
    }
  } finally {
    await db.close();
  }
});
