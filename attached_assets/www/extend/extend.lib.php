<?php
if (!defined('_GNUBOARD_')) exit; // 개별 페이지 접근 불가

$menu_query = sql_query(" select bo_table,bo_category_list from {$g5['board_table']} where bo_order > 0 order by bo_order ");
$menu_query2 = sql_query(" select bo_table,bo_subject from {$g5['board_table']} where bo_order > 0 order by bo_order ");
for($i=0;$row=sql_fetch_array($menu_query);$i++) {
if(strpos($_SERVER['REDIRECT_URL'],'_'.$row['bo_table'])!==false||$bo_table==$row['bo_table']) {
	if($row['bo_table']=="map") $sect_id = $map_id;
	if($row['bo_table']=="square") $sect_id = $square_id;
	if($row['bo_table']=="madang") $sect_id = $md_id;
	if($row['bo_table']=="notice") $sect_id = $no_id;
	if($row['bo_table']=="ebook") $sect_id = $ebook_id;
	if($row['bo_table']=="shop") $sect_id = $shop_id;
	if($row['bo_table']=="calendar") $sect_id = $calendar_id;
	$sect = $row['bo_table'];
	$sectCate = $row['bo_category_list'];
	$sectTable = $g5['write_prefix'].$sect;
	$sectWrInfo = get_write($sectTable,$sect_id);
}
}

$memberInfo = get_member($member['mb_id']);

$map_table = $g5['write_prefix']."map";
if($map_id)
	$mapWrInfo = get_write($map_table,$map_id);
if($wr_id)
	$mapWrInfo = get_write($map_table,$wr_id);
$mapWrMb = get_member($mapWrInfo['mb_id']);

$square_table = $g5['write_prefix']."square";
if($square_id)
	$squareWrInfo = get_write($square_table,$square_id);
if($wr_id)
	$squareWrInfo = get_write($square_table,$wr_id);
$squareWrMb = get_member($squareWrInfo['mb_id']);

$madang_table = $g5['write_prefix']."madang";
if($md_id)
	$mdWrInfo = get_write($madang_table,$md_id);
if($wr_id)
	$mdWrInfo = get_write($madang_table,$wr_id);
$mdWrMb = get_member($mdWrInfo['mb_id']);

$notice_table = $g5['write_prefix']."notice";
if($no_id)
	$noWrInfo = get_write($notice_table,$no_id);
if($wr_id)
	$noWrInfo = get_write($notice_table,$wr_id);
$noWrMb = get_member($noWrInfo['mb_id']);

$ebook_table = $g5['write_prefix']."ebook";
if($ebook_id)
	$ebWrInfo = get_write($ebook_table,$ebook_id);
if($wr_id)
	$ebWrInfo = get_write($ebook_table,$wr_id);
$ebWrMb = get_member($ebWrInfo['mb_id']);

$shop_table = $g5['write_prefix']."shop";
if($shop_id)
	$shWrInfo = get_write($shop_table,$shop_id);
if($wr_id)
	$shWrInfo = get_write($shop_table,$wr_id);
$shWrMb = get_member($shWrInfo['mb_id']);

$calendar_table = $g5['write_prefix']."calendar";
if($calendar_id)
	$calWrInfo = get_write($calendar_table,$calendar_id);
if($wr_id)
	$calWrInfo = get_write($calendar_table,$wr_id);
$calWrMb = get_member($calWrInfo['mb_id']);


$disabled = ' disabled="disabled"';
if($is_member) $disabled = '';

$sect_wr_id = "";
if($wr_id) $sect_wr_id = "?".$bo_table."_id=".$wr_id;

function get_board($bo_table)
{
	return sql_fetch(" select * from g5_board where bo_table = '{$bo_table}' ");
}

function getPaging($rows,$prows,$dbTable,$isSqlType,$getId,$getMb,$DOM,$cate) {
	$isSql = "";
	if(strpos($isSqlType,'A')!==false)
		$isSql .= "wr_is_comment = 0";
	if(strpos($isSqlType,'a')!==false)
		$isSql .= "wr_is_comment = 1";
	if(strpos($isSqlType,'B')!==false)
		$isSql .= " and wr_1 = 'ok'";
	if(strpos($isSqlType,'C')!==false)
		$isSql .= " and mb_id = '{$getMb}'";
	if(strpos($isSqlType,'D')!==false)
		$isSql .= " and ca_name = '{$cate}'";
	if(strpos($isSqlType,'d')!==false)
		$isSql .= " and ca_name != '{$cate}'";
	$max = sql_fetch(" select MAX(wr_id) as wr_id from {$dbTable} where {$isSql} ");
	$is_getId = "and wr_id >= '{$getId}'";
	if(!$getId) $is_getId = "and wr_id >= '{$max['wr_id']}'";
	$pTotalNum = sql_fetch(" select count(wr_id) as num from {$dbTable} where {$isSql} ");
	$pNextNum = sql_fetch(" select count(wr_id) as num from {$dbTable} where {$isSql} {$is_getId} ");
	$totalPage = ceil($pTotalNum['num']/$rows);
	$totalPgroup = ceil($pTotalNum['num']/($rows*$prows));
	$curPage = ceil($pNextNum['num']/$rows);
	$curPgroup = ceil($pNextNum['num']/($rows*$prows));
//	if($curPgroup<1) $curPgroup = 1;
	$start = 1+($curPgroup-1)*$prows; ///페이지에서 시작하는 번호
//	if($start<1) $start = 1;
	$preStart = $start-1;
	$end = $prows;
	if($totalPage-(($curPgroup-1)*$prows)<=$prows) $end = $totalPage-(($curPgroup-1)*$prows);
	$nexEnd = $end+1;
	$str = '';
    $str .= '<div class="btn-group btn-group-sm marTB10">'.PHP_EOL;
if($curPgroup>1) {
	$str .= '<button type="button" class="btn btn-default btn-page" rel="'.$DOM.':'.$preStart.':'.$rows.':'.$prows.':'.$getId.':'.$isSqlType.':'.$getMb.':'.$dbTable.':'.$cate.'"';
	$str .= '><i class="fa fa-angle-double-left"></i></button>'.PHP_EOL;
}
	for($p=0;$p<$end;$p++) {
	$pn[$p] = $start+$p;
	$pClass[$p] = " btn-default";
	$disabled[$p] = "";
		if($curPage==$pn[$p]) {
			$pClass[$p] = " btn-primary";
			$disabled[$p] = ' disabled="disabled"';
		}
	$str .= '<button type="button" class="btn'.$pClass[$p].' btn-page" rel="'.$DOM.':'.$pn[$p].':'.$rows.':'.$prows.':'.$getId.':'.$isSqlType.':'.$getMb.':'.$dbTable.':'.$cate.'"'.$disabled[$p].'>'.$pn[$p].'</button>'.PHP_EOL;
	}
if($curPgroup<$totalPgroup) {
	$str .= '<button type="button" class="btn btn-default btn-page" rel="'.$DOM.':'.$nexEnd.':'.$rows.':'.$prows.':'.$getId.':'.$isSqlType.':'.$getMb.':'.$dbTable.':'.$cate.'"';
	$str .= '><i class="fa fa-angle-double-right"></i></button>'.PHP_EOL;
}
	$str .= '</div>'.PHP_EOL;
	return $str;
}

function getLat($position) { ////위도값 뽑기
	$posArray = explode(',',$position);
	$latTrim = trim($posArray[0]);
	$Lat = substr($latTrim,1);
	return $Lat;
}
function getLng($position) { ////위도값 뽑기
	$posArray = explode(',',$position);
	$lngTrim = trim($posArray[1]);
	$Lng = substr($lngTrim,0,-1);
	return $Lng;
}
?>