import { format } from './dist/index.js';

const sql = `
select tbs_used_info.tablespace_name,
       tbs_used_info.alloc_mb,
       tbs_used_info.used_mb,
       tbs_used_info.max_mb,
       tbs_used_info.free_of_max_mb,
       tbs_used_info.used_of_max || '%' pct
from (select a.tablespace_name,
             round(a.bytes_alloc / 1024 / 1024, 2)                          alloc_mb,
             round((a.bytes_alloc - nvl(b.bytes_free, 0)) / 1024 / 1024, 2) used_mb,
             round(
                     (a.bytes_alloc - nvl(b.bytes_free, 0)) * 100 / a.maxbytes,
                     2
             )                                                              used_of_max,
             round(
                     (a.maxbytes - a.bytes_alloc + nvl(b.bytes_free, 0)) / 1048576,
                     2
             )                                                              free_of_max_mb,
             round(a.maxbytes / 1048576, 2)                                 max_mb
      from (select f.tablespace_name,
                   used_mb,
                   sum(f.bytes) bytes_alloc,
                   sum(
                           decode(f.autoextensible, 'YES', f.maxbytes, 'No', f.bytes)
                   )            maxbytes
            from dba_data_files f
            group by tablespace_name) a,
           (select f.tablespace_name,
                   sum(f.bytes) bytes_free
            from dba_free_space f
            group by tablespace_name) b
      where a.tablespace_name = b.tablespace_name) tbs_used_info
order by tbs_used_info.used_of_max desc;
`;

const formatData = format(sql, { language: 'sql', propertyAccessWidth: 200 });
console.log(formatData);
