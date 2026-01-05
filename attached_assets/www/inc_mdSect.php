<?php include_once('./_common.php');
$rows = 25; ///페이지당 글수
$prows = 10; ///출력 페이지수
$is_uId = "";
if($uId) $is_uId = "and mb_id = '{$uId}'";
$is_where = "wr_is_comment = 0 {$is_uId}";
$max = sql_fetch(" select MAX(wr_id) as wr_id from {$madang_table} where {$is_where} ");
$thisId = $max['wr_id'];
$wrTable = $madang_table;
$mbId = $uId;
if($pageNum) {
	$thisId = $getId;
	$wrTable = $dbTable;
	$mbId = $getMb;
	if($mbId)
		$is_where = "wr_is_comment = 0 and mb_id = '{$mbId}'";
	else
		$is_where = "wr_is_comment = 0";
}
$pNextNum = sql_fetch(" select count(wr_id) as num from {$wrTable} where {$is_where} and wr_id >= '{$thisId}' ");
$curPage = ceil($pNextNum['num']/$rows);
if($pageNum) $curPage = $pageNum;
$begin = ($curPage-1)*$rows;
$sqSect = sql_query(" select * from {$wrTable} where {$is_where} order by wr_num limit {$begin},{$rows} ");
	for($i=0;$row=sql_fetch_array($sqSect);$i++) {
		$sbj = mb_strimwidth($row['wr_subject'],0,60,"…","UTF-8");
		$wr_content = preg_replace("/<(.*?)\>/","",$row['wr_content']);
		$wr_content = preg_replace("/&nbsp;/","",$wr_content);
		$rowDatetime10 = substr($row['wr_datetime'],0,10);
		$name = "<span class='name round5'>".mb_strimwidth($row['wr_name'],0,12,"…","UTF-8")."</span> ";
		if($row['wr_datetime']>=date("Y-m-d H:i:s", G5_SERVER_TIME - (24 * 3600)))
			$name = "<span class='nameNew round5'>".mb_strimwidth($row['wr_name'],0,12,"…","UTF-8")."</span> ";
		if($rowDatetime10==G5_TIME_YMD)
			$rowDatetime = substr($row['wr_datetime'],11,8);
		else
			$rowDatetime = substr($row['wr_datetime'],2,8);
		$cmt = "";
		if($row['wr_comment']>0) $cmt = "&nbsp; <i class='fa fa-comments'></i> <span class='comment-num'>".$row['wr_comment']."</span>";
		?>
	<li>
		<a href="<?php echo G5_URL?>/_madang/?md_id=<?php echo $row['wr_id']?>">
			<span class="date"><?php echo $rowDatetime?></span> <?php echo $name.$sbj?> <span class="rToo"><?php echo $cmt?> &nbsp; <span class="wrHit round5"><?php echo number_format($row['wr_hit'])?></span></span>
		</a>
	</li>

<?php } ?>
<div id="mdSect" class="padd10 pageBox">
<?php
if($mbId)
	echo getPaging($rows,$prows,$wrTable,'AC',$thisId,$mbId,'mdSect','');
else
	echo getPaging($rows,$prows,$wrTable,'A',$thisId,'','mdSect','');
?>
</div>
