<?php
include_once('./_common.php');
$rows = 5; ///페이지당 글수
$prows = 5; ///출력 페이지수
if(!$getMb) $getMb = $mapWrInfo['mb_id'];
$is_where = "wr_is_comment = 0 and wr_1 = 'ok' and mb_id = '{$getMb}'";
$max = sql_fetch(" select MAX(wr_id) as wr_id from {$map_table} where {$is_where} ");
if($map_id) $thisId = $map_id;
else if($getId) $thisId = $getId;
else if(!$map_id&&!$getId) $thisId = $max['wr_id'];
$is_getId = "and wr_id >= '{$thisId}'";
//	if(!$getId&&(($map_id&&$mapWrInfo['wr_1']!='ok')||!$map_id))
//		$is_getId = "and wr_id >= '{$max['wr_id']}'";
$pNextNum = sql_fetch(" select count(wr_id) as num from {$map_table} where {$is_where} {$is_getId} ");
	$curPage = ceil($pNextNum['num']/$rows);
	if($pageNum) $curPage = $pageNum;
	$begin = ($curPage-1)*$rows;
	if(!$getId&&!$pageNum) $begin = 0;
$photoGrid = sql_query(" select * from {$map_table} where {$is_where} order by wr_num limit {$begin},{$rows} ");
for($i=0;$row=sql_fetch_array($photoGrid);$i++) {
	$con = explode("[Photo:",$row['wr_content']);
	$cnt = count($con);
	if($cnt<2) { $pH = G5_IMG_URL.'/icon_pH.png';
	} else {
		$con2 = explode("]",$con[1]);
		$pId = $con2[0];
		$pInfo = sql_fetch(" select * from gpf_picasa where id = '{$pId}' ");
		$pH = $pInfo['thumb2'];
	}
	$photoUnacc = "";
	if($row['wr_1']!='ok')
		$photoUnacc = "<span class='photoUnacc'>미등록</span>";
	$modify = "";
	if($is_member&&$member['mb_id']==$row['mb_id']&&!G5_IS_MOBILE)
		$modify = "<a class='btn btn-success btn-xs modify' href='".G5_BBS_URL."/write.php?bo_table=map&wr_id=".$row['wr_id']."&w=u'>수정</a>";
	$sbj = mb_strimwidth($row['wr_subject'],0,30,"…","UTF-8");
	$name = mb_strimwidth($row['wr_name'],0,10,"…","UTF-8");
	$cmt = "";
	if($row['wr_comment']>0) $cmt = "<span class='comment-num'>".$row['wr_comment']."</span>";
	$chkDisp = " dispN";
	if($row['wr_id']==$thisId) $chkDisp = "";
	$rowDatetime10 = substr($row['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = substr($row['wr_datetime'],11,8);
	else
		$rowDatetime = $rowDatetime10;
?>
<li rel="#888">
	<a href="<?php echo G5_URL?>/_map/?map_id=<?php echo $row['wr_id']?>">
	<div class="photo" style="background:url('<?php echo $pH?>');background-position:center center;background-repeat:no-repeat;"></div>
	<div class="info">
		<span class="title"><?php echo $sbj?></span><br />
		<span class="name"><?php echo $name?></span><br />
		<span class="date"><?php echo $rowDatetime?></span>
		<span class="cmt"><i class="fa fa-comments"></i> <span class='commentNum' id='wrId<?php echo $row['wr_id']?>'><?php echo $cmt?></span></span>
	</div>
	<i class="fa fa-check-square-o fa-2x thisImg<?php echo $chkDisp?>"></i>
	<?php echo $photoUnacc.$modify?>
	</a>
</li>
<?php } ?>
<div id="mapMbList" class="pageBox">
<?php echo getPaging($rows,$prows,$map_table,'ABC',$thisId,$getMb,'mapMbList','')?>
</div>
