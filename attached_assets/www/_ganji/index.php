<?php
define('_SQUARE_', true);
include_once('./_common.php');
include_once(G5_PATH.'/_head.php');
if(!$Dcode) goto_url(G5_URL.'/_ganji/?Dcode='.date('Y').'-'.date('n').'-'.date('j'));

$Ddata = explode('-',$Dcode);
$year = $Ddata[0];
$month = $Ddata[1];
$day = $Ddata[2];
$thisToday = "default";
if($year==date('Y')&&$month==date('n')&&$day==date('j')) $thisToday = "success";

$selectedDay = sql_fetch(" select * from calenda_data where cd_sy = '{$year}' and cd_sm = '{$month}' and cd_sd = '{$day}' ");

$month_dayF = sql_fetch(" select * from calenda_data where cd_sy = '{$year}' and cd_sm = '{$month}' order by cd_no asc limit 0, 1 ");
$month_dayL = sql_fetch(" select * from calenda_data where cd_sy = '{$year}' and cd_sm = '{$month}' order by cd_no desc limit 0, 1 ");

$pre_year_real = $year - 1;
$nex_year_real = $year + 1;

$pre_month = $month - 1;
$pre_year = $year; //당월이 1월이 아니면 이전년도는 적용하지 않음
if($month==1) {
	$pre_month = 12; //당월이 1월이면 이전년도는 12월이 되며
	$pre_year = $year - 1; //연도는 이전년도를 적용
}
$nex_month = $month + 1;
$nex_year = $year; //당월이 12월이 아니면 이후년도는 적용하지 않음
if($month==12) {
	$nex_month = 1; //당월이 12월이면 이후년도는 1월이 되며
	$nex_year = $year + 1; //연도는 이후년도를 적용
}

$pre_month_day_sunL = sql_fetch(" select * from calenda_data where cd_sy = '{$pre_year}' and cd_sm = '{$pre_month}' and cd_week = '일' order by cd_no desc limit 0, 1 ");
$nex_month_day_satF = sql_fetch(" select * from calenda_data where cd_sy = '{$nex_year}' and cd_sm = '{$nex_month}' and cd_week = '토' order by cd_no asc limit 0, 1 ");

$first_cd_no = $month_dayF['cd_no'];
if($month_dayF['cd_week']!='일')
	$first_cd_no = $pre_month_day_sunL['cd_no'];
$last_cd_no = $month_dayL['cd_no'];
if($month_dayL['cd_week']!='토')
	$last_cd_no = $nex_month_day_satF['cd_no'];

$mon_date = " select * from calenda_data where cd_no >= '{$first_cd_no}' and cd_no <= '{$last_cd_no}' order by cd_no ";
$result_date = sql_query($mon_date);
?>

<div id="sqCon">

	<table cellspacing="0" cellpadding="0" id='calTable0' align='center'>
		<tr align="center">
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_ganji/?Dcode=<?php echo $pre_year_real?>-<?php echo $month?>-<?php echo date('j')?>"><i class="fa fa-chevron-left"></i></a></td>
			<td><select class="form-control" name="calY" onChange="window.open(value,'_self');">
		<script>
		for(y=1841; y<=2110; y++){
			s = "";
			if(y=='<?php echo $year?>')	s = " selected";
			document.write("<option value='<?php echo G5_URL.'/_ganji/?Dcode='?>"+y+"<?php echo '-'.$month.'-'.date('j')?>'"+s+">" + y + "</option>");
		}
		</script></select></td>
			<td>년</td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_ganji/?Dcode=<?php echo $nex_year_real?>-<?php echo $month?>-<?php echo date('j')?>"><i class="fa fa-chevron-right"></i></a></td>
			<td class="padd5"><a class="btn btn-<?php echo $thisToday?> btn-xs" href='<?php G5_URL?>/_ganji/?Dcode=<?php echo date('Y')?>-<?php echo date('n')?>-<?php echo date('j')?>' id='today'>오늘</a></td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_ganji/?Dcode=<?php echo $pre_year?>-<?php echo $pre_month?>-<?php echo date('j')?>"><i class="fa fa-chevron-left"></i></a></td>
			<td><select class="form-control" name="calM" onChange="window.open(value,'_self');">
		<script>
		for(n=1; n<=12; n++){
			s = "";
			if(n=='<?php echo $month?>') s = " selected";
			document.write("<option value='<?php echo G5_URL.'/_ganji/?Dcode='.$year.'-'?>"+n+"-<?php echo date('j')?>'"+s+">" + n + "</option>");
		}
		</script></select></td>
			<td>월</td>
			<td class="padd5"><a class="btn btn-default btn-xs" href="<?php echo G5_URL?>/_ganji/?Dcode=<?php echo $nex_year?>-<?php echo $nex_month?>-<?php echo date('j')?>"><i class="fa fa-chevron-right"></i></a></td>
		</tr>
	</table>

	<div id="calendarBox">
		<table id="calTable"  class="table table-bordered">
			<thead>
				<tr class="warning">
					<th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
				</tr>
			</thead>
			<tbody>
<?php
for($d=0; $row_date=sql_fetch_array($result_date); $d++) {
	if($d%7==0||$d==0) echo "<tr>";
	$tdClass[$d] = "";
	$noneDay[$d] = " fwB";
	if($row_date['cd_sm']!=$month) {
		$tdClass[$d] = "active";
		$noneDay[$d] = " noneDay";
	}
	$this_today[$d] = "";
	if($row_date['cd_sy']==date('Y')&&$row_date['cd_sm']==date('n')&&$row_date['cd_sd']==date('j')) $this_today[$d] = " success";
	
	$Cganji[$d] = "";
	if($row_date['cd_hdganjee']==$selectedDay['cd_hdganjee'])
		$Cganji[$d] = "Sel";
	
	$ld[$d] = $row_date['cd_ld'];
	$lDaySel[$d] = "";
	if($row_date['cd_ld']==1) {
		$ld[$d] = "<b>".$row_date['cd_lm'].".".$row_date['cd_ld']."</b>";
		$lDaySel[$d] = "Sel";
	}
?>
					<td class="calTd <?php echo $tdClass[$d].$this_today[$d]?>" rel="<?php echo $row_date['cd_sy'].'-'.$row_date['cd_sm'].'-'.$row_date['cd_sd']?>">
						<span class='sDay<?php echo $noneDay[$d]?>'><?php echo $row_date['cd_sd']?></span>
						<div class='lDay<?php echo $lDaySel[$d]?> round5'><?php echo $ld[$d]?></div>
						<div class='ganji<?php echo $Cganji[$d]?> round5'><?php echo $row_date['cd_hdganjee']?></div>
						<div class='jeolgi'><?php echo $row_date['cd_kterms']?></div>
					</td>

<?php } ?>
			</tbody>
		</table>
	</div>

<?php
if($square_id) {
// 수정, 삭제 링크
$update_href = $delete_href = '';
// 로그인중이고 자신의 글이라면 또는 관리자라면 패스워드를 묻지 않고 바로 수정, 삭제 가능
if (($member['mb_id']&&($member['mb_id']==$squareWrInfo['mb_id']))||$is_admin) {
    $update_href = G5_BBS_URL.'/write.php?w=u&amp;bo_table=square&amp;wr_id='.$square_id.'&amp;page='.$page;
    $delete_href = G5_BBS_URL.'/delete.php?bo_table=square&amp;wr_id='.$square_id.'&amp;page='.$page;
    if ($is_admin)
    {
//        set_session("ss_delete_token", $token = uniqid(time()));
		$token = get_session('ss_delete_token');
        $delete_href = G5_BBS_URL.'/delete.php?bo_table=square&amp;wr_id='.$square_id.'&amp;token='.$token.'&amp;page='.$page;
    }
}
	$commentNum = "";
	if($squareWrInfo['wr_comment']>0) $commentNum = "<span class='comment-num'>".$squareWrInfo['wr_comment']."</span>";
	$sVW = sql_fetch(" select vi_view from g5_visit where vi_ip = '{$_SERVER['REMOTE_ADDR']}' ");
	$con = explode("[Img:",$squareWrInfo['wr_content']);
	$cnt = count($con);
	$wrContent = $con[0];
	for($i=1;$i<$cnt;$i++)
	{
		$con2 = explode("]",$con[$i]);
		$pId = $con2[0];
		$pCode = "[Img:".$pId."]";
		$pInfo = sql_fetch(" select * from gpf_picasa where id = '{$pId}' ");
		$imgWidth = $pInfo['width'];
		$imgWidthDiv = $pInfo['width']."px";
		if($sVW['vi_view']<$pInfo['width']) {
			$imgWidth = "100%";
			$imgWidthDiv = "100%";
		} //$sVW['vi_view'];
		$pHtml = "<div class='photoBoxSqare' style='width:".$imgWidthDiv."' id='BB".$pId."'>".PHP_EOL;
//		$pHtml = "<img src='".$pInfo['imgurl']."' class='sect-photo' id='".$pId."'>".PHP_EOL;
		$pHtml .= "<img src='".$pInfo['imgurl']."' width='".$imgWidth."' class='lazyload' id='".$pId."'>".PHP_EOL;
		if($pInfo['summary']) $pHtml .= "<i class='fa fa-th-large'></i> ".$pInfo['summary'].PHP_EOL;
		$pHtml .= "</div>".PHP_EOL;
		$conPart = "[Img:".$con[$i];
		$wrContent .= str_replace($pCode, $pHtml, $conPart);
	}
	$rowDatetime10 = substr($squareWrInfo['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = substr($squareWrInfo['wr_datetime'],11,8);
	else
		$rowDatetime = $rowDatetime10;
	?>
	
	<div id="sqView">
		<div class="navBox">
			<i class="fa fa-calendar"></i> 60간지
		</div>
		<?php if(G5_IS_MOBILE) { ?>
		<div id="subBtn">
			<button class="btn btn-default showSub" id="cate"><i class="fa fa-list-ul"></i></button>
			<button class="btn btn-default showSub" id="comm"><i class="fa fa-comments"></i></button>
		</div>
		<?php } ?>
		<div id="title">
			<h1 id="subject"><?php echo $squareWrInfo['wr_subject']?></h1>
			<span id="name"><?php echo $squareWrInfo['wr_name']?></span>
			<span id="cate"><?php echo $squareWrInfo['ca_name']?></span>
			<span id="dateTime"><?php echo $rowDatetime?></span>
			<span id="hit">조회:<?php echo $squareWrInfo['wr_hit']?></span>
		</div>
		<div class='toolBox'>
		<?php if(!G5_IS_MOBILE&&($member['mb_id']==$squareWrInfo['mb_id']||$is_admin=='super')) { ?>
			<a class='btn btn-success' type='button' href='<?php echo $update_href?>'>수정</a>
			<a class='btn btn-danger' type='button' href='<?php echo $delete_href?>' onclick='del(this.href); return false;'>삭제</a>
		<?php } ?>
			<div class="padd10">
				<a type="button" class="btn btn-default scroll openCommentBox" href="#openCommentBox2" id="openCommentBox1" rel="square:<?php echo $square_id?>"><i class="fa fa-comment fa-3x"></i> <span class='commentNum' id='wrId<?php echo $square_id?>'><?php echo $commentNum?></span></a>
			</div>
		</div>
		<div class="cl-bo">
		<?php echo $wrContent?>
			<div id="subjCateListBox" class="innerPaging">
				<?php include G5_PATH."/inc_subjCateList.php";?>
			</div>
		</div>
		<div class='toolBox'>
		<?php if(!G5_IS_MOBILE&&($member['mb_id']==$sectWrInfo['mb_id']||$is_admin=='super')) { ?>
			<a class='btn btn-success' type='button' href='<?php echo $update_href?>'>수정</a>
			<a class='btn btn-danger' type='button' href='<?php echo $delete_href?>' onclick='del(this.href); return false;'>삭제</a>
		<?php } ?>
			<div class="padd10 txtR">
				<button type="button" class="btn btn-default openCommentBox" id="openCommentBox2" rel="square:<?php echo $square_id?>"><i class="fa fa-comment fa-3x"></i> <span class='commentNum' id='wrId<?php echo $square_id?>'><?php echo $commentNum?></span></button>
			</div>
		</div>
		<div class="txtC padd10 cl-bo dispN" id="iconLoading"><img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" /></div>
		<div id="wrCommentsBox" class="cl-bo<?php if($mode=='openComment') { ?> open<?php } ?>">
			<?php if($mode=='openComment') include G5_PATH."/inc_commentList.php" ?>
		</div>
	</div><!-- id="sqView"-->
<?php
//조회수 증가
$ss_name = 'ss_view_square_'.$square_id;
if (!get_session($ss_name))
{
	sql_query(" update {$square_table} set wr_hit = wr_hit + 1 where wr_id = '{$square_id}' ");
	// 자신의 글이면 통과
	if ($squareWrInfo['mb_id']&&$squareWrInfo['mb_id'] == $member['mb_id']) {
	;
	} else if ($is_guest&&$squareWrInfo['wr_ip']==$_SERVER['REMOTE_ADDR']) {
	// 비회원이면서 등록된 아이피가 같다면 자신의 글이므로 통과
	;
	}
	set_session($ss_name, TRUE);
}

} else { //$square_id가 없을 때 
?>

		<div id="mainSquare">
			<div id="squareSectBox" class="paddT50">
				<?php // include G5_PATH."/inc_squareSect.php";?>
			</div>
		</div>

<?php
} //$square_id가 없을 때
?>
</div><!-- id="sqCon"-->

<div id="sqSub" class="<?php if(!G5_IS_MOBILE) { ?>sqSubAbs<?php } else { ?>sqSubFix<?php } ?>">

	<div id="commentsBox">
		<!--h3 id="sub-title"><i class="fa fa-comments fa-2x"></i> 60간지 댓글</h3-->
		<div id="commentsBoxWrap" class="commList">
			<?php include G5_PATH."/inc_commentBox.php";?>
		</div>
	</div>
	<?php if(G5_IS_MOBILE) { ?>
	<button class="btn btn-default hideSub"><i class="fa fa-times"></i></button>
	<?php } ?>
</div><!-- id="sqSub"-->

<?php
include_once(G5_PATH.'/_tail.php');
?>