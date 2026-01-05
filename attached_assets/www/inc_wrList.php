<?php
include_once('./_common.php');
$sch1 = explode('_',$_SERVER['REDIRECT_URL']);
$sch2 = explode('/',$sch1[1]);
$sect = $sch2[0];
$sectTable = $g5['write_prefix'].$sect;
//$sectSql = sql_query(" select * from {$sectTable} ");

echo $sect." / ".$sectTable." / ".$_SERVER['REDIRECT_URL'];
?>
<br />.........mmmmmm