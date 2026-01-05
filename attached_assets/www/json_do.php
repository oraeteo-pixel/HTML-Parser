<?php
include_once('./_common.php');

if($action=='moveWr') {
	$boCal = get_board('calendar');
	$calCateList = explode('|',$boCal['bo_category_list']);
	$is_where = "wr_is_comment = 0 and ca_name = '{$calCateList[0]}' ";
	$calNo = sql_query(" select * from {$calendar_table} where {$is_where} order by wr_1 desc ");
	$calNoticeList = "";
	for($n=0;$row=sql_fetch_array($calNo);$n++)
	{
		$wrUp = sql_fetch(" select wr_id,wr_1 from {$calendar_table} where {$is_where} and wr_1 > '{$row['wr_1']}' order by wr_1 limit 0,1 ");
		$wrDn = sql_fetch(" select wr_id,wr_1 from {$calendar_table} where {$is_where} and wr_1 < '{$row['wr_1']}' order by wr_1 desc limit 0,1 ");
		$disabledUp = $disabledDn = "";
		if(!$wrUp['wr_1']) $disabledUp = ' disabled="disabled"';
		if(!$wrDn['wr_1']) $disabledDn = ' disabled="disabled"';
		$calNoticeList .= '
		<li>
			<a href="'.G5_URL.'/_calendar/?cal='.$cal.'&amp;calendar_id='.$row['wr_id'].'&amp;calCate='.$row['ca_name'].'">'.$row['wr_subject'].'</a>
			<div class="tool">
				<button class="btn btn-info btn-xs moveWr" rel="calendar:'.$row['wr_id'].':'.$row['wr_1'].':'.$wrUp['wr_id'].':'.$wrUp['wr_1'].'"'.$disabledUp.'><i class="fa fa-arrow-up"></i></button>
				<button class="btn btn-warning btn-xs moveWr" rel="calendar:'.$row['wr_id'].':'.$row['wr_1'].':'.$wrDn['wr_id'].':'.$wrDn['wr_1'].'"'.$disabledDn.'><i class="fa fa-arrow-down"></i></button>
			</div>
		</li>
		';
	}
$wrTable = $g5['write_prefix'].$boTable;
sql_query(" update {$wrTable} set wr_1 = '{$new1}' where wr_id = '{$wrId}' ");
sql_query(" update {$wrTable} set wr_1 = '{$wr1}' where wr_id = '{$newId}' ");
	$calNoticeInfo = array();
	array_push($calNoticeInfo, array(
		'calNoticeList'=>$calNoticeList
	));
	echo json_encode(array("calNoticeInfo"=>$calNoticeInfo));
	exit;
}

if($action=='map_search_info')
{
	$map_query = sql_query(" select * from {$map_table} where wr_is_comment = 0 and wr_subject like '%{$map_info}%' order by wr_num ");
	$mapInfo = array();
	while($row=sql_fetch_array($map_query)) {
		$sbj = mb_strimwidth($row['wr_subject'],0,55,"…","UTF-8");
		$photos = sql_query(" select id from gpf_picasa where wr_id = '{$row['wr_id']}' and map_address != '' order by id ");
		$photos_num = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$row['wr_id']}' ");
		$unpos_num = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$row['wr_id']}' and map_address = '' ");
		$photosIds = "";
		for($i=0;$prow=sql_fetch_array($photos);$i++) {
			$photosIds .= "p".$prow['id']."_";
		}
//		$pId = "p".$row['wr_id'];
		array_push($mapInfo, array(
			'map_id'=>$row['wr_id'],
			'map_name'=>$sbj,
			'photosIds'=>$photosIds,
			'photo_num'=>$photos_num['num'],
			'unpos_num'=>$unpos_num['num']
		));
	}
	echo json_encode(array("mapInfo"=>$mapInfo));
	exit;	
}

if($action=='map_id_photos')
{
	$mapInfo = get_write($map_table,$map_id);
	$mapIdPhotos = sql_query(" select * from gpf_picasa where wr_id = '{$map_id}' and map_address != '' and bo_table = 'map' order by id ");
	$photos_num = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$map_id}' and map_address != '' and bo_table = 'map' ");
	$unpos_num = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$map_id}' and map_address = '' and bo_table = 'map' ");
	$sbj = mb_strimwidth($mapInfo['wr_subject'],0,30,"…","UTF-8");
	$photoInfo = array();
	while($row=sql_fetch_array($mapIdPhotos)) {
		$pId = "p".$row['id'];
		$samePos = sql_fetch(" select count(id) as num from gpf_picasa where map_address = '{$row['map_address']}' ");
		array_push($photoInfo, array(
			'photo_pos'=>$row['map_address'],
			'photo_thumb'=>$row['thumb2'],
			'photo_id'=>$pId,
			'photo_title'=>$row['summary'],
			'photo_date'=>$row['photo_date'],
			'map_name'=>$sbj,
			'photo_num'=>$photos_num['num'],
			'unpos_num'=>$unpos_num['num'],
			'samePos_num'=>$samePos['num']
		));
	}
	echo json_encode(array("photoInfo"=>$photoInfo));
	exit;	
}

if($action=='map_id_photosGrid')
{
	$mapInfo = get_write($map_table,$map_id);
	$photos = sql_query(" select * from gpf_picasa where wr_id = '{$map_id}' and map_address != '' and bo_table = 'map' order by map_address desc, id ");
	$photos_num = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$map_id}' and map_address != '' and bo_table = 'map' ");
	$unpos_num = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$map_id}' and map_address = '' and bo_table = 'map' ");
	$sbj = mb_strimwidth($mapInfo['wr_subject'],0,30,"…","UTF-8");
	$photoInfo = array();
	for($i=0;$row=sql_fetch_array($photos);$i++) {
		$pId = "p".$row['id'];
		$sMP = sql_query(" select id from gpf_picasa where map_address = '{$row['map_address']}' and wr_id = '{$map_id}' order by id ");
		$sMPn = sql_fetch(" select count(id) as num from gpf_picasa where map_address = '{$row['map_address']}' and wr_id = '{$map_id}' ");
		for($s=0;$srow=sql_fetch_array($sMP);$s++) $sMPs[$i] .= $srow['id'].'_';
		$sMPss = explode('_',$sMPs[$i]);
		$sMPC = "";
		if($sMPn['num']>1) {
			$last = $sMPn['num']-1;
			if($row['id']==$sMPss[0]) $sMPC = "<div class='sMP sMP1'><i class='fa fa-map-marker'></i> 동일위치</div>";
			else if($row['id']==$sMPss[$last]) $sMPC = "<div class='sMP sMP3'> : ".$sMPn['num']." <i class='fa fa-map-marker'></i></div>";
			else $sMPC = "<div class='sMP sMP2'>&nbsp;</div>";
		}
		array_push($photoInfo, array(
			'photo_pos'=>$row['map_address'],
			'photo_title'=>$row['summary'],
			'photo_thumb'=>$row['thumb2'],
			'photo_id'=>$pId,
			'map_name'=>$sbj,
			'photo_num'=>$photos_num['num'],
			'unpos_num'=>$unpos_num['num'],
			'sMPC'=>$sMPC
		));
	}
	echo json_encode(array("photoInfo"=>$photoInfo));
	exit;
}
	
if($action=='upPhotoInfo') {
	sql_query("
		update gpf_picasa set
			summary = '{$summary}',
			photo_date = '{$photoDate}',
			photo_content = '{$photoContent}'
			where id = '{$pId}'
		");
}

if($action=='upIPnSectViewWidth') {
	sql_query("update g5_visit set	vi_view = '{$sVW}' where vi_ip = '{$addr}'");
}

if($action=='mngPf') {
	$pfSql = sql_fetch(" select mb_profile from {$g5['member_table']} where mb_id = '{$mb_id}' ");
	$pfInfo = array();
	array_push($pfInfo, array(
		'con'=>$pfSql['mb_profile']
	));
	echo json_encode(array("pfInfo"=>$pfInfo));
	exit;
}
if($action=='upPfCon') {
	$mb_profile = str_replace('\\r\\n', '<br />', $mb_profile);
	sql_query(" update {$g5['member_table']} set mb_profile = '{$mb_profile}' where mb_id = '{$mb_id}' ");
	$pfSql = sql_fetch(" select mb_profile from {$g5['member_table']} where mb_id = '{$mb_id}' ");
	$mbProfile = str_replace('\\r\\n', '<br />', $pfSql['mb_profile']);
	$pfInfo = array();
	array_push($pfInfo, array(
		'con'=>$mbProfile
	));
	echo json_encode(array("pfInfo"=>$pfInfo));
	exit;
}

if($action=='btnUpCa') {
$mb_cate_list = explode(";",$caList);
$cnt = count($mb_cate_list);
for($i=0;$i<$cnt;$i++) {
$mb_cate = trim($mb_cate_list[$i]);
$mb_cate = preg_replace('/\s\s+/', ' ', $mb_cate);
$mb_cate = str_replace('\"','',$mb_cate);
$mb_cate = str_replace("\'","",$mb_cate);
	if(strlen($mb_cate)>0)
	$mb_cate_list_trim .= ";".$mb_cate;
}
	$mb_cate_list_trim = substr($mb_cate_list_trim,1);
	$sub_cate_list = explode(';',$mb_cate_list_trim.';광장');
	$cnt = count($sub_cate_list);
	$cateString = "";
	for($s=0;$s<$cnt;$s++) {
		$checked_sub[$s] = "";
		if($sub_cate_list[$s]=='광장') $checked_sub[$s] = " checked";
		if($sub_cate_list[$s]!='')
		$cateString .= "<label><input type='radio' name='ca_name' value='".$sub_cate_list[$s]."'".$checked_sub[$s].">".$sub_cate_list[$s]."</label> &nbsp;";
	}
sql_query(" update {$g5['member_table']} set mb_2 = '{$mb_cate_list_trim}'	where mb_id = '{$member['mb_id']}' ");
	$cateInfo = array();
	array_push($cateInfo, array(
		'cateList'=>$mb_cate_list_trim,
		'cateString'=>$cateString
	));
	echo json_encode(array("cateInfo"=>$cateInfo));
	exit;
}

if($action=='accessPhotos') {
$relInfo = explode(':',$thisRel);
$wrId = $relInfo[0];
	if($relInfo[1]=='ok') {
		sql_query(" update {$map_table} set wr_1 = 'ok' where wr_id = '{$wrId}' ");
	}else{
		sql_query(" update {$map_table} set wr_1 = '' where wr_id = '{$wrId}' ");
	}
}

if($action=='uploadPhotos')
{
if($chkPhotos=='') alert('선택한 사진이 없습니다.');
$cP = explode('_',$chkPhotos);
$cnt = count($cP) - 1;
for($i=0;$i<$cnt;$i++) {
	$pId = substr($cP[$i],1);
	sql_query(" update gpf_picasa set map_address = '{$mapPos}' where id = {$pId} ");
}
goto_url(G5_URL.$mapUrl);
}

if($action=='unMapPos')
{
if($chkPhotos=='') alert('선택한 사진이 없습니다.');
$cP = explode('_',$chkPhotos);
$cnt = count($cP) - 1;
for($i=0;$i<$cnt;$i++) {
	$pId = substr($cP[$i],1);
	sql_query(" update gpf_picasa set map_address = '' where id = {$pId} ");
}
}

if($action=='getModal') {
	$pageSql = sql_fetch(" select wr_content from {$page_table} where wr_subject = '{$title}' ");
	$pageInfo = array();
	array_push($pageInfo, array(
		'pContent'=>$pageSql['wr_content']
	));
	echo json_encode(array("pageInfo"=>$pageInfo));
	exit;
}

if($action=='getPageList') {
	$thisRelInfo = explode(':',$thisRel);
	$DOM = $thisRelInfo[0];
	$pNum = $thisRelInfo[1];
	$rows = $thisRelInfo[2];
	$prows = $thisRelInfo[3];
	$getId = $thisRelInfo[4];
	$isSqlType = $thisRelInfo[5];
	$getMb = $thisRelInfo[6];
	$dbTable = $thisRelInfo[7];
	$cate = $thisRelInfo[8];
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
	$pTotalNum = sql_fetch(" select count(wr_id) as num from {$dbTable} where {$isSql} ");
	$totalPage = ceil($pTotalNum['num']/$rows);
	$totalPgroup = ceil($pTotalNum['num']/($rows*$prows));
	$curPgroup = ceil($pNum/$prows);
	$start = 1+($curPgroup-1)*$prows; ///페이지에서 시작하는 번호
	$preStart = $start-1;
	$end = $prows;
	if($totalPage-(($curPgroup-1)*$prows)<=$prows)
		$end = $totalPage-(($curPgroup-1)*$prows);
	$nexEnd = $end+1;
	$str = '';
    $str .= '<div class="btn-group btn-group-sm marTB10">';
if($curPgroup>1) {
	$str .= '<button type="button" class="btn btn-default btn-page" rel="'.$DOM.':'.$preStart.':'.$rows.':'.$prows.':'.$getId.':'.$isSqlType.':'.$getMb.':'.$dbTable.':'.$cate.'"';
	$str .= '><i class="fa fa-angle-double-left"></i></button>';
}
	for($p=0;$p<$end;$p++) {
	$pn[$p] = $start+$p;
	$pClass[$p] = " btn-default";
	$disabled[$p] = "";
		if($pNum==$pn[$p]) {
			$pClass[$p] = " btn-primary";
			$disabled[$p] = ' disabled="disabled"';
		}
	$str .= '<button type="button" class="btn'.$pClass[$p].' btn-page" rel="'.$DOM.':'.$pn[$p].':'.$rows.':'.$prows.':'.$getId.':'.$isSqlType.':'.$getMb.':'.$dbTable.':'.$cate.'"'.$disabled[$p].'>'.$pn[$p].'</button>';
	}
if($curPgroup<$totalPgroup) {
	$str .= '<button type="button" class="btn btn-default btn-page" rel="'.$DOM.':'.$nexEnd.':'.$rows.':'.$prows.':'.$getId.':'.$isSqlType.':'.$getMb.':'.$dbTable.':'.$cate.'"';
	$str .= '><i class="fa fa-angle-double-right"></i></button>';
}
	$str .= '</div>';
	$pageListInfo = array();
	array_push($pageListInfo, array(
		'str'=>$str
	));
	echo json_encode(array("pageListInfo"=>$pageListInfo));
	exit;
}
if($action=='mdComment') {
	$dbTable = $g5['write_prefix'].$bo_table;
	$commentSql = sql_fetch(" select wr_content from {$dbTable} where wr_id = '{$wr_id}' ");
	$commentInfo = array();
	array_push($commentInfo, array(
		'wrContent'=>$commentSql['wr_content']
	));
	echo json_encode(array("commentInfo"=>$commentInfo));
	exit;
}
if($action=='getReWrIdInfo') {
	$dbTable = $g5['write_prefix'].$bo_table;
	$wrIdInfo = get_write($dbTable,$wr_id);
	$WrCommentReplyLen = strlen($wrIdInfo['wr_comment_reply'])+1;
	$reMb = sql_query(" select wr_id,wr_name from {$dBtable} where wr_is_comment = 1 and wr_parent = '{$wrIdInfo['wr_parent']}' and wr_comment = '{$wrIdInfo['wr_comment']}' and wr_comment_reply like '{$wrIdInfo['wr_comment_reply']}%' and length(wr_comment_reply) = '{$WrCommentReplyLen}' order by wr_id limit 0,1 ");
	$reWrIdInfo = array();
	while($row=sql_fetch_array($reMb)) {
		array_push($reWrIdInfo, array(
			'wrId'=>$row['wr_id'],
			'wrName'=>$row['wr_name']
		));	
	}
	echo json_encode(array("reWrIdInfo"=>$reWrIdInfo));
	exit;
}

////성공 실패시 메세지
function fail($message) {
	die(json_encode(array('status'=>'fail','message'=>$message)));
}
function success($message) {
	die(json_encode(array('status'=>'success','message'=>$message)));
}

?>

