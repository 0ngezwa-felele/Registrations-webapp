-- DROP TABLE IF EXISTS towns CASCADE;

create table towns(
    id serial not null primary key,
    townName varChar(255) not null,
    loc varChar(255) not null
);
-- DROP TABLE IF EXISTS registrations CASCADE;
create table registrations(
    id serial not null primary key,
    regNo varChar(255) not null,
    townID integer not null, 
    foreign key(townID) references towns(id)
);

INSERT INTO towns (townName, loc) VALUES ('Cape Town', 'CA');
INSERT INTO towns (townName, loc) VALUES ('Paarl', 'CJ');
INSERT INTO towns (townName, loc) VALUES ('Bellville', 'CY');