"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseDsn_1 = require("./parseDsn");
const ava_1 = __importDefault(require("ava"));
const testParse = ava_1.default.macro((t, connectionOptions) => {
    t.deepEqual((0, parseDsn_1.parseDsn)(t.title), connectionOptions);
});
(0, ava_1.default)('postgresql://', testParse, {});
(0, ava_1.default)('postgresql://localhost', testParse, {
    host: 'localhost',
});
(0, ava_1.default)('postgresql://localhost:5432', testParse, {
    host: 'localhost',
    port: 5432,
});
(0, ava_1.default)('postgresql://localhost/foo', testParse, {
    databaseName: 'foo',
    host: 'localhost',
});
(0, ava_1.default)('postgresql://foo@localhost', testParse, {
    host: 'localhost',
    username: 'foo',
});
(0, ava_1.default)('postgresql://foo:bar@localhost', testParse, {
    host: 'localhost',
    password: 'bar',
    username: 'foo',
});
(0, ava_1.default)('postgresql://localhost/?&application_name=baz', testParse, {
    applicationName: 'baz',
    host: 'localhost',
});
(0, ava_1.default)('postgresql://fo%2Fo:b%2Far@localhost/ba%2Fz', testParse, {
    databaseName: 'ba/z',
    host: 'localhost',
    password: 'b/ar',
    username: 'fo/o',
});
(0, ava_1.default)(
// cspell: disable-next-line
'postgresql://db_user:db_password@%2Fcloudsql%2Fproject-id%3Aregion-id1%3Acloudsqlinstance-name/database-name', testParse, {
    databaseName: 'database-name',
    host: '/cloudsql/project-id:region-id1:cloudsqlinstance-name',
    password: 'db_password',
    username: 'db_user',
});
// https://github.com/gajus/slonik/issues/468#issuecomment-1736020990
// cspell: disable-next-line
(0, ava_1.default)('postgresql://%2Fvar%2Flib%2Fpostgresql/database-name', testParse, {
    databaseName: 'database-name',
    host: '/var/lib/postgresql',
});
// https://github.com/gajus/slonik/issues/468#issuecomment-1736020990
// cspell: disable-next-line
(0, ava_1.default)('postgresql:///database-name?host=/var/lib/postgresql', testParse, {
    databaseName: 'database-name',
    host: '/var/lib/postgresql',
});
//# sourceMappingURL=parseDsn.test.js.map