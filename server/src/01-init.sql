\c secret_server

create table secrets (
  id serial primary key,
  hash text not null unique,
  secret_text text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  remaining_views int not null
);

insert into secrets (hash, secret_text, expires_at, remaining_views) values ('abcd', 'Secret text EFGH', now() + interval '100 mins', 50);