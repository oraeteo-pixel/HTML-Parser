<?php
include_once('./_common.php');
$rows = 15; ///페이지당 글수
$prows = 10; ///출력 페이지수
$thisId = $sect_id;
$wrTable = $sectTable;
if($pageNum) {
	$thisId = $getId;
	$wrTable = $dbTable;
}
$wrTableName = explode('_',$wrTable);
$sectName = $wrTableName[2];
$thisIdInfo = get_write($wrTable,$thisId);
$is_wr1 = "";
//if($sectName=='map') $is_wr1 = "and wr_1 = 'ok'";
$is_where = "wr_is_comment = 0 {$is_wr1}";
$pNextNum = sql_fetch(" select count(wr_id) as num from {$wrTable} where {$is_where} and wr_id >= '{$thisId}' ");
$curPage = ceil($pNextNum['num']/$rows);
if($pageNum) $curPage = $pageNum;
$begin = ($curPage-1)*$rows;
$subj = sql_query(" select * from {$wrTable} where {$is_where} order by wr_num limit {$begin},{$rows} ");
for($i=0;$row=sql_fetch_array($subj);$i++) {
	$sbj = mb_strimwidth($row['wr_subject'],0,60,"…","UTF-8");
	$cmt = "";
	if($row['wr_comment']>0) $cmt = "<i class='fa fa-comment'></i> <span class='comment-num'>".$row['wr_comment']."</span>";
	$rowDatetime10 = substr($row['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = "<strong>".substr($row['wr_datetime'],11,5)."</strong>";
	else
		$rowDatetime = substr($row['wr_datetime'],5,5);
	$selected = "";
	if($thisId==$row['wr_id']) $selected = " class='selected'";
	$name = "<span class='name round5'>".mb_strimwidth($row['wr_name'],0,12,"…","UTF-8")."</span> ";
	if($row['wr_datetime']>=date("Y-m-d H:i:s", G5_SERVER_TIME - (24 * 3600)))
		$name = "<span class='nameNew round5'>".mb_strimwidth($row['wr_name'],0,12,"…","UTF-8")."</span> ";
	if($sectName=='notice')
		$name = "<span class='name round5'>관리자</span> ";
	$sName = $sectName;
	if($sectName=='madang') $sName = "md";
	if($sectName=='notice') $sName = "no";
?>
<li>
	<a href="<?php echo G5_URL?>/_<?php echo $sectName?>/?<?php echo $sName?>_id=<?php echo $row['wr_id']?>"<?php echo $selected?>>
		<span class="date"><?php echo $rowDatetime?></span> <?php echo $name.$sbj?> <span class="rToo"><?php echo $cmt?> &nbsp; <span class="hit round5"><?php echo number_format($row['wr_hit'])?></span></span>
	</a>
</li>
<?php } ?>
<div id="subjList" class="pageBox">
<?php
	echo getPaging($rows,$prows,$wrTable,'A',$thisId,'','subjList','');
?>
</div>