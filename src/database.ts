export const CREATE_USER_TABLE = `
  CREATE TABLE User (
    id INT NOT NULL,
    name VARCHAR(10) NOT NULL,
    email: VARCHAR(10) NOT NULL,
    image: VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE
  )
`
