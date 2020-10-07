drop table if exists towns;
drop table if exists reg_number;

create table towns(
    id serial not null primary key,
    town_name text,
    code text
);
create table reg_number(
    id serial not null primary key,
    towns_id int,
    reg varchar not null,
    foreign key (towns_id) references towns(id)

);
 