import { g as sql, e as eq } from './index2-CrtZLkpF.js';
export { K as BaseName, F as Column, L as ColumnAliasProxyHandler, M as ColumnBuilder, N as Columns, O as ConsoleLogWriter, P as DefaultLogger, Q as DrizzleError, R as DrizzleQueryError, S as ExtraConfigBuilder, T as ExtraConfigColumns, U as FakePrimitiveParam, V as IsAlias, W as Many, X as Name, Y as NoopLogger, Z as One, _ as OriginalName, $ as Param, a0 as Placeholder, a1 as QueryPromise, a2 as Relation, a3 as RelationTableAliasProxyHandler, a4 as Relations, a5 as SQL, a6 as Schema, a7 as StringChunk, a8 as Subquery, a9 as Table, aa as TableAliasProxyHandler, ab as TransactionRollbackError, ac as View, ad as ViewBaseConfig, ae as WithSubquery, af as aliasedRelation, ag as aliasedTable, ah as aliasedTableColumn, i as and, ai as applyMixins, aj as arrayContained, ak as arrayContains, al as arrayOverlaps, a as asc, am as between, an as bindIfParam, ao as createMany, ap as createOne, aq as createTableRelationsHelpers, k as desc, ar as entityKind, as as exists, at as extractTablesRelationalConfig, au as fillPlaceholders, av as getColumnNameAndConfig, aw as getOperators, ax as getOrderByOperators, ay as getTableColumns, az as getTableLikeName, aA as getTableName, aB as getTableUniqueName, aC as getViewName, aD as getViewSelectedFields, B as gt, C as gte, aE as hasOwnEntityKind, aF as haveSameKeys, aG as ilike, m as inArray, E as is, aH as isConfig, aI as isDriverValueEncoder, aJ as isNotNull, j as isNull, aK as isSQLWrapper, aL as isTable, aM as isView, y as like, n as lt, z as lte, aN as mapColumnsInAliasedSQLToAlias, aO as mapColumnsInSQLToAlias, aP as mapRelationalRow, aQ as mapResultRow, aR as mapUpdateSet, aS as name, A as ne, aT as noopDecoder, aU as noopEncoder, aV as noopMapper, aW as normalizeRelation, aX as not, aY as notBetween, aZ as notExists, a_ as notIlike, x as notInArray, a$ as notLike, D as or, b0 as orderSelectedFields, b1 as param, b2 as placeholder, b3 as relations, b4 as textDecoder } from './index2-CrtZLkpF.js';
export { a as avg, b as avgDistinct, c as count, d as countDistinct, m as max, e as min, s as sum, f as sumDistinct } from './aggregate-CbMItvtT.js';
import 'os';
import 'fs';
import 'net';
import 'tls';
import 'crypto';
import 'stream';
import 'perf_hooks';
import './shared-server-DaWdgxVh.js';

function toSql(value) {
  return JSON.stringify(value);
}
function l2Distance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <-> ${toSql(value)}`;
  }
  return sql`${column} <-> ${value}`;
}
function l1Distance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <+> ${toSql(value)}`;
  }
  return sql`${column} <+> ${value}`;
}
function innerProduct(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <#> ${toSql(value)}`;
  }
  return sql`${column} <#> ${value}`;
}
function cosineDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <=> ${toSql(value)}`;
  }
  return sql`${column} <=> ${value}`;
}
function hammingDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <~> ${toSql(value)}`;
  }
  return sql`${column} <~> ${value}`;
}
function jaccardDistance(column, value) {
  if (Array.isArray(value)) {
    return sql`${column} <%> ${toSql(value)}`;
  }
  return sql`${column} <%> ${value}`;
}

export { cosineDistance, eq, hammingDistance, innerProduct, jaccardDistance, l1Distance, l2Distance, sql };
//# sourceMappingURL=index-BX8F4bJ2.js.map
