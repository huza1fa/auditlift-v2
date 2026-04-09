import { g as sql, e as eq } from './index2-C4rYKX5Z.js';
export { J as BaseName, F as Column, K as ColumnAliasProxyHandler, L as ColumnBuilder, M as Columns, N as ConsoleLogWriter, O as DefaultLogger, P as DrizzleError, Q as DrizzleQueryError, R as ExtraConfigBuilder, S as ExtraConfigColumns, T as FakePrimitiveParam, U as IsAlias, V as Many, W as Name, X as NoopLogger, Y as One, Z as OriginalName, _ as Param, $ as Placeholder, a0 as QueryPromise, a1 as Relation, a2 as RelationTableAliasProxyHandler, a3 as Relations, a4 as SQL, a5 as Schema, a6 as StringChunk, a7 as Subquery, a8 as Table, a9 as TableAliasProxyHandler, aa as TransactionRollbackError, ab as View, ac as ViewBaseConfig, ad as WithSubquery, ae as aliasedRelation, af as aliasedTable, ag as aliasedTableColumn, i as and, ah as applyMixins, ai as arrayContained, aj as arrayContains, ak as arrayOverlaps, a as asc, al as between, am as bindIfParam, an as createMany, ao as createOne, ap as createTableRelationsHelpers, k as desc, aq as entityKind, ar as exists, as as extractTablesRelationalConfig, at as fillPlaceholders, au as getColumnNameAndConfig, av as getOperators, aw as getOrderByOperators, ax as getTableColumns, ay as getTableLikeName, az as getTableName, aA as getTableUniqueName, aB as getViewName, aC as getViewSelectedFields, B as gt, C as gte, aD as hasOwnEntityKind, aE as haveSameKeys, aF as ilike, m as inArray, E as is, aG as isConfig, aH as isDriverValueEncoder, aI as isNotNull, j as isNull, aJ as isSQLWrapper, aK as isTable, aL as isView, y as like, n as lt, z as lte, aM as mapColumnsInAliasedSQLToAlias, aN as mapColumnsInSQLToAlias, aO as mapRelationalRow, aP as mapResultRow, aQ as mapUpdateSet, aR as name, A as ne, aS as noopDecoder, aT as noopEncoder, aU as noopMapper, aV as normalizeRelation, aW as not, aX as notBetween, aY as notExists, aZ as notIlike, x as notInArray, a_ as notLike, D as or, a$ as orderSelectedFields, b0 as param, b1 as placeholder, b2 as relations, b3 as textDecoder } from './index2-C4rYKX5Z.js';
export { a as avg, b as avgDistinct, c as count, d as countDistinct, m as max, e as min, s as sum, f as sumDistinct } from './aggregate-D-tQqRQs.js';
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
//# sourceMappingURL=index-CShQ_mIj.js.map
