<?php
include_once('./_common.php');
$rows = 5; ///페이지당 글수
$prows = 5; ///출력 페이지수
//$thisId = $square_id;
$thisId = $sect_id;
if($sqCate) $caName = $sqCate;
if($ebCate) $caName = $ebCate;
if($shCate) $caName = $shCate;
if($calCate) $caName = $calCate;
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
$is_cate = "";
$ca_url = "";
if($caName) {
	$is_cate = "and ca_name = '{$caName}'";
	if($sectName=='square')
		$ca_url = "&amp;sqCate=".urldecode($caName);
	else if($sectName=='ebook')
		$ca_url = "&amp;ebCate=".urldecode($caName);
	else if($sectName=='shop')
		$ca_url = "&amp;shCate=".urldecode($caName);
	else if($sectName=='calendar')
		$ca_url = "&amp;calCate=".urldecode($caName);
}
$is_mbId = "and mb_id = '{$mbId}'";
if($sectName=='ebook'||$sectName=='shop'||$sectName=='calendar') $is_mbId = "";
$is_where = "wr_is_comment = 0 {$is_mbId} {$is_wr1} {$is_cate}";
//$pNextNum = sql_fetch(" select count(wr_id) as num from {$square_table} where {$is_where} and wr_id >= '{$thisId}' ");
$pNextNum = sql_fetch(" select count(wr_id) as num from {$wrTable} where {$is_where} and wr_id >= '{$thisId}' ");
$curPage = ceil($pNextNum['num']/$rows);
if($pageNum) $curPage = $pageNum;
$begin = ($curPage-1)*$rows;
//$subjCate = sql_query(" select * from {$square_table} where {$is_where} order by wr_num limit {$begin},{$rows} ");
if($sectName=='calendar')
	$subjCate = sql_query(" select * from {$wrTable} where {$is_where} order by wr_1 desc limit {$begin},{$rows} ");
else
	$subjCate = sql_query(" select * from {$wrTable} where {$is_where} order by wr_num limit {$begin},{$rows} ");
for($i=0;$row=sql_fetch_array($subjCate);$i++) {
	$sbj = mb_strimwidth($row['wr_subject'],0,60,"…","UTF-8");
	$cmt = "";
	if($row['wr_comment']>0) $cmt = "<i class='fa fa-comment'></i> <span class='comment-num'>".$row['wr_comment']."</span>";
	$rowDatetime10 = substr($row['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = "<strong>".substr($row['wr_datetime'],11,5)."</strong>";
	else
		$rowDatetime = substr($row['wr_datetime'],5,5);
	$selected = "";
	if($thisId==$row['wr_id']) $selected = " class='selected round5'";
	$cate = "";
	if($row['ca_name'])
		$cate = "<span class='cate round5'>".mb_strimwidth($row['ca_name'],0,12,"…","UTF-8")."</span> ";
	$sName = $sectName;
	if($sectName=='madang') $sName = "md";

?>
<li>
	<a href="<?php echo G5_URL?>/_<?php echo $sectName?>/?<?php echo $sName?>_id=<?php echo $row['wr_id'].$ca_url?>"<?php echo $selected?>>
		<span class="date"><?php echo $rowDatetime?></span> <?php echo $cate.$sbj?> <span class="rToo"><?php echo $cmt?> &nbsp; <span class="hit round5"><?php echo number_format($row['wr_hit'])?></span></span>
	</a>
</li>
<?php } ?>
<div id="subjCateList" class="pageBox">
<?php
//	if($sqCate||$ebCate||$shCate)
	if($caName) {
		if($sectName=='ebook'||$sectName=='shop'||$sectName=='calendar')
			echo getPaging($rows,$prows,$wrTable,'AD',$thisId,'','subjCateList',$caName);
		else
			echo getPaging($rows,$prows,$wrTable,'ACD',$thisId,$mbId,'subjCateList',$caName);
	} else {
		if($sectName=='ebook'||$sectName=='shop'||$sectName=='calendar')
			echo getPaging($rows,$prows,$wrTable,'A',$thisId,'','subjCateList','');
		else
			echo getPaging($rows,$prows,$wrTable,'AC',$thisId,$mbId,'subjCateList','');
	}
?>
</div>