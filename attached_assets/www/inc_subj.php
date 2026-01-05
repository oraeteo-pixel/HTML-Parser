<?php
include_once('./_common.php');
$rows = 5; ///페이지당 글수
$prows = 5; ///출력 페이지수
//$thisId = $square_id;
$thisId = $sect_id;
$caName = $sqCate;
//$mbId = $squareWrInfo['mb_id'];
$mbId = $sectWrInfo['mb_id'];
$wrTable = $sectTable;
if($pageNum) {
	$thisId = $getId;
	$caName = $cate;
	$mbId = $getMb;
	$wrTable = $dbTable;
}

$wrTableName = explode('_',$wrTable);
$sectName = $wrTableName[2];
$mbInfo = get_member($mbId);
//$thisIdInfo = get_write($square_table,$thisId);
$thisIdInfo = get_write($wrTable,$thisId);
if($sectName=='map') {
		echo '<strong><i class="fa fa-map-marker"></i> '.$mbInfo['mb_nick'].'님의 지도정보</strong>';
} else if($sectName=='madang') {
		echo '<strong><i class="fa fa-square-o"></i> 열린마당 전체 글</strong>';
} else {
	if($caName)
		echo '<strong><i class="fa fa-list-ul"></i> '.$mbInfo['mb_nick'].'님의 '.$caName.'</strong>';
	else
		echo '<strong><i class="fa fa-list-ul"></i> '.$mbInfo['mb_nick'].'님의 전체 광장글</strong>';
}
$is_cate = "";
$ca_url = "";
if($caName) {
	$is_cate = "and ca_name = '{$caName}'";
	$ca_url = "&amp;sqCate=".urldecode($caName);
}
$is_wr1 = "";
if($sectName=='map') $is_wr1 = "and wr_1 = 'ok'";
$is_mbId = "";
if($sectName=='square'||$sectName=='map')
$is_mbId = "and mb_id = '{$mbId}'";
$is_where = "wr_is_comment = 0 {$is_mbId} {$is_wr1} {$is_cate}";
//$pNextNum = sql_fetch(" select count(wr_id) as num from {$square_table} where {$is_where} and wr_id >= '{$thisId}' ");
$pNextNum = sql_fetch(" select count(wr_id) as num from {$wrTable} where {$is_where} and wr_id >= '{$thisId}' ");
$curPage = ceil($pNextNum['num']/$rows);
if($pageNum) $curPage = $pageNum;
$begin = ($curPage-1)*$rows;
//$subjCate = sql_query(" select * from {$square_table} where {$is_where} order by wr_num limit {$begin},{$rows} ");
$subjCate = sql_query(" select * from {$wrTable} where {$is_where} order by wr_num limit {$begin},{$rows} ");
for($i=0;$row=sql_fetch_array($subjCate);$i++) {
	$sbj = mb_strimwidth($row['wr_subject'],0,30,"…","UTF-8");
	$cmt = "";
	if($row['wr_comment']>0) $cmt = "<span class='cmt'><i class='fa fa-comment'></i> <span class='comment-num'>".$row['wr_comment']."</span></span>";
	$rowDatetime10 = substr($row['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = "<strong>".substr($row['wr_datetime'],11,5)."</strong>";
	else
		$rowDatetime = substr($row['wr_datetime'],5,5);
	$selected = "";
	if($thisId==$row['wr_id']) $selected = " class='selected round5'";
	$name = mb_strimwidth($row['wr_name'],0,12,"…","UTF-8");
	$sName = $sectName;
	$uName = "";
	if($sectName=='madang') {
		$sName = "md";
		$uName = "<span class='name round5'>".$name."</span> ";
	}
?>
<li>
	<a href="<?php echo G5_URL?>/_<?php echo $sectName?>/?<?php echo $sName?>_id=<?php echo $row['wr_id'].$ca_url?>"<?php echo $selected?>>
		<span class="date"><?php echo $rowDatetime?></span> <?php echo $uName.$sbj?> <?php echo $cmt?>
	</a>
</li>
<?php } ?>
<div id="subjCateList" class="pageBox">
<?php
if($sectName=='map') {
	echo getPaging($rows,$prows,$wrTable,'ABC',$thisId,$mbId,'subjCateList',$caName);
} else if($sectName=='madang') {
	echo getPaging($rows,$prows,$wrTable,'A',$thisId,'','subjCateList','');
} else {
	if($sqCate)
		echo getPaging($rows,$prows,$wrTable,'ACD',$thisId,$mbId,'subjCateList',$caName);
	else
		echo getPaging($rows,$prows,$wrTable,'AC',$thisId,$mbId,'subjCateList','');
}
?>
</div>