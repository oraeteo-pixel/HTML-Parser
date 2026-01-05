<?php include_once('./_common.php');
$rows = 10; ///페이지당 글수
$prows = 10; ///출력 페이지수
$is_uId = "";
if($uId) $is_uId = "and mb_id = '{$uId}'";
//$is_where = "wr_is_comment = 0 and wr_1 = 'ok' {$is_uId}";
$is_where = "wr_is_comment = 0 {$is_uId}";
$max = sql_fetch(" select MAX(wr_id) as wr_id from {$map_table} where {$is_where} ");
$thisId = $max['wr_id'];
$wrTable = $map_table;
$mbId = $uId;
if($pageNum) {
	$thisId = $getId;
	$wrTable = $dbTable;
	$mbId = $getMb;
	if($mbId)
		$is_where = "wr_is_comment = 0 and mb_id = '{$mbId}'";
	else
		$is_where = "wr_is_comment = 0 ";
}
$pNextNum = sql_fetch(" select count(wr_id) as num from {$wrTable} where {$is_where} and wr_id >= '{$thisId}' ");
$curPage = ceil($pNextNum['num']/$rows);
if($pageNum) $curPage = $pageNum;
$begin = ($curPage-1)*$rows;
$mapSect = sql_query(" select * from {$wrTable} where {$is_where} order by wr_num limit {$begin},{$rows} ");
	for($i=0;$row=sql_fetch_array($mapSect);$i++) {
		?>
		<div class="sectList">
		<?php
			$sbj = mb_strimwidth($row['wr_subject'],0,60,"…","UTF-8");
			$wr_content = preg_replace("/<(.*?)\>/","",$row['wr_content']);
			$wr_content = preg_replace("/&nbsp;/","",$wr_content);
			$con = explode("[Photo:",$wr_content);
			$cnt = count($con);
			$wrContent = $con[0];
			$photosGrid = '';
			for($i=1;$i<$cnt;$i++)
			{
				$con2 = explode("]",$con[$i]);
				$pId = $con2[0];
				$pCode = "[Photo:".$pId."]";
				$pInfo = sql_fetch(" select thumb2,thumb2_width from gpf_picasa where id = '{$pId}' ");
				$conPart = "[Photo:".$con[$i];
				$wrContent .= str_replace($pCode,'',$conPart);
				$photosGrid .= "<li style=\"background:url('".$pInfo['thumb2']."');width:".$pInfo['thumb2_width']."px;height:80px;background-position:center center;')\"></li>";
			}
			$wr_con = mb_strimwidth($wrContent,0,130,"…","UTF-8");
			$rowDatetime10 = substr($row['wr_datetime'],0,10);
			if($rowDatetime10==G5_TIME_YMD)
				$rowDatetime = substr($row['wr_datetime'],11,8);
			else
				$rowDatetime = $rowDatetime10;
			$commentNum = "";
			if($row['wr_comment']>0) $commentNum = "&nbsp; <i class='fa fa-comments'></i> <span class='comment-num'>".$row['wr_comment']."</span>";
		?>
			<h1>
				<a href="<?php echo G5_URL?>/_map/?map_id=<?php echo $row['wr_id']?>"><?php echo $sbj.$commentNum?></a>
			</h1>
			<div class="con">
				<strong class="name"><?php echo $row['wr_name']?></strong>
				<a class="btn btn-default btn-xs" href="javascript:;" onclick="window.open('<?php echo G5_BBS_URL?>/memo_form.php?me_recv_mb_id=<?php echo $row['mb_id']?>','name','resizable=no,width=550,height=500,status=no,scrollbars=yes,menubar=no');return false"><i class="fa fa-envelope-o"></i> 쪽지</a>
				<span class="date"><?php echo $rowDatetime;?></span> &nbsp; <span class="wrHit round5"><?php echo number_format($row['wr_hit'])?></span><br />
				<?php echo $wr_con?>
			</div>
			<div class="photosGrid"><?php  echo $photosGrid?></div>
		</div>
	<?php } ?>
<div id="mapSect" class="padd10 pageBox">
<?php
if($mbId)
	echo getPaging($rows,$prows,$wrTable,'AC',$thisId,$mbId,'mapSect','');
//	echo getPaging($rows,$prows,$wrTable,'ABC',$thisId,$mbId,'mapSect','');
else
	echo getPaging($rows,$prows,$wrTable,'A',$thisId,'','mapSect','');
//	echo getPaging($rows,$prows,$wrTable,'AB',$thisId,'','mapSect','');
?>
</div>
