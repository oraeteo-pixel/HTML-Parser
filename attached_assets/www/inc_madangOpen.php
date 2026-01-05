<?php
include_once('./_common.php');
$rows = 8; ///페이지당 글수
$prows = 5; ///출력 페이지수
if(!$getMb) $getMb = $mdWrInfo['mb_id'];
$is_where = "wr_is_comment = 0 and ca_name != '공지'";
$max = sql_fetch(" select MAX(wr_id) as wr_id from {$madang_table} where {$is_where} ");
	if(!$getId&&$md_id&&$mdWrInfo['ca_name']!='공지')
		$getId = $md_id;
	$is_getId = "and wr_id >= '{$getId}'";
	if((!$getId&&!$md_id)||$mdWrInfo['ca_name']=='공지')
		$is_getId = "and wr_id >= '{$max['wr_id']}'";
$pNextNum = sql_fetch(" select count(wr_id) as num from {$madang_table} where {$is_where} {$is_getId} ");
	$curPage = ceil($pNextNum['num']/$rows);
	if($pageNum) $curPage = $pageNum;
	$begin = ($curPage-1)*$rows;
	if(!$getId&&!$pageNum) $begin = 0;
$mdArray = sql_query(" select * from {$madang_table} where {$is_where} order by wr_num limit {$begin},{$rows} ");
for($i=0;$row=sql_fetch_array($mdArray);$i++) {
	$sbj = mb_strimwidth($row['wr_subject'],0,30,"…","UTF-8");
	$name = mb_strimwidth($row['wr_name'],0,10,"…","UTF-8");
	$cmt = "";
	if($row['wr_comment']>0) $cmt = "<span class='comment-num'>".$row['wr_comment']."</span>";
	$selected = "";
	$chkDisp = " dispN";
	if($row['wr_id']==$getId) {
		$selected = " class='selected'";
		$chkDisp = "";
	}
	if($row['wr_id']==$getId) $selected = " class='selected'";
	$rowDatetime10 = substr($row['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = substr($row['wr_datetime'],11,8);
	else
		$rowDatetime = $rowDatetime10;
?>
<li rel="#888"<?php echo $selected?>>
	<a href="<?php echo G5_URL?>/?md_id=<?php echo $row['wr_id']?>">
	<div class="info">
		<span class="title"><?php echo $sbj?></span><br />
		<span class="name"><?php echo $name?></span>
		<span class="cate"><?php echo $row['ca_name']?></span>
		<span class="date"><?php echo $rowDatetime?></span>
		<span class="cmt"><i class="fa fa-comments"></i> <span class='commentNum' id='wrId<?php echo $row['wr_id']?>'><?php echo $cmt?></span></span>
	</div>
	<i class="fa fa-check-square-o fa-2x thisImg<?php echo $chkDisp?>"></i>
	</a>
</li>
<?php } ?>
<div id="madangOpen" class="pageBox">
<?php
	echo getPaging($rows,$prows,$madang_table,'Ad',$getId,$getMb,'madangOpen','공지');
?>
</div>
