<?php
define('_SQUARE_', true);
include_once('./_common.php');
include_once(G5_PATH.'/_head.php');
?>

<div id="sqCon">
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
			<a href="<?php echo G5_URL?>/_square/"><i class="fa fa-th-large"></i> 오리알터광장</a>
		</div>
		<div id="subBtn">
			<button class="btn btn-default showSub" id="profile"><i class="fa fa-user"></i></button>
			<button class="btn btn-default showSub" id="cate"><i class="fa fa-list-ul"></i></button>
			<button class="btn btn-default showSub" id="comm"><i class="fa fa-comments"></i></button>
		</div>
		<div id="title">
			<h1 id="subject"><?php echo $squareWrInfo['wr_subject']?></h1>
			<span id="name"><?php echo $squareWrInfo['wr_name']?></span>
			<a class="btn btn-default btn-xs" href="javascript:;" onclick="window.open('<?php echo G5_BBS_URL?>/memo_form.php?me_recv_mb_id=<?php echo $squareWrInfo['mb_id']?>','name','resizable=no,width=550,height=500,status=no,scrollbars=yes,menubar=no');return false"><i class="fa fa-envelope-o"></i> 쪽지</a>
			<span id="cate"><?php echo $squareWrInfo['ca_name']?></span>
			<span id="dateTime"><?php echo $rowDatetime?></span>
			<span class="wrHit round5"><?php echo number_format($squareWrInfo['wr_hit'])?></span>
		</div>
		<div class='toolBox'>
		<?php if($member['mb_id']==$squareWrInfo['mb_id']||$is_admin=='super') { ?>
			<a class='btn btn-success' type='button' href='<?php echo $update_href?>'>수정</a>
			<a class='btn btn-danger' type='button' href='<?php echo $delete_href?>' onclick='del(this.href); return false;'>삭제</a>
		<?php } ?>
			<div class="padd10">
				<a type="button" class="btn btn-default scroll openCommentBox" href="#openCommentBox2" id="openCommentBox1" rel="square:<?php echo $square_id?>"><i class="fa fa-comment fa-2x"></i> <span class='commentNum' id='wrId<?php echo $square_id?>'><?php echo $commentNum?></span></a>
			</div>
		</div>
		<div id="sqContent">
		<?php echo $wrContent?>
		</div>
		<div class='toolBox'>
		<?php if($member['mb_id']==$sectWrInfo['mb_id']||$is_admin=='super') { ?>
			<a class='btn btn-success' type='button' href='<?php echo $update_href?>'>수정</a>
			<a class='btn btn-danger' type='button' href='<?php echo $delete_href?>' onclick='del(this.href); return false;'>삭제</a>
		<?php } ?>
			<div class="padd10 txtR">
				<button type="button" class="btn btn-default openCommentBox" id="openCommentBox2" rel="square:<?php echo $square_id?>"><i class="fa fa-comment fa-2x"></i> <span class='commentNum' id='wrId<?php echo $square_id?>'><?php echo $commentNum?></span></button>
			</div>
		</div>
		<div class="txtC padd10 cl-bo dispN" id="iconLoading"><img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" /></div>
		<div id="wrCommentsBox" class="cl-bo<?php if($mode=='openComment') { ?> open<?php } ?>">
			<?php if($mode=='openComment') include G5_PATH."/inc_commentList.php" ?>
		</div>
		<div id="subjCateListBoxWrap" class="round5">
<?php
	if($sqCate)
		echo '<h2><i class="fa fa-list-ul"></i> '.$squareWrInfo['wr_name'].'님의 '.$sqCate.'</h2>';
	else
		echo '<h2><i class="fa fa-list-ul"></i> '.$squareWrInfo['wr_name'].'님의 전체 광장글</h2>';
?>
			<img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" id="subjCateListLoading" />
			<div id="subjCateListBox" class="innerPaging">
			<?php include G5_PATH."/inc_subjCateList.php";?>
			</div>
		</div>
		<div id="subjListBoxWrap">
			<h2><i class="fa fa-th-large"></i> 오리알터광장 전체 글</h2>
			<img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" id="subjListLoading" />
			<div id="subjListBox" class="innerPaging">
			<?php include G5_PATH."/inc_subjList.php";?>
			</div>
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

$uInfo = get_member($uId);
?>

		<div id="mainSect">
			<h2 id="sectTitle"><i class="fa fa-th-large"></i> <?php if(!G5_IS_MOBILE||G5_IS_MOBILE&&!$uId) { ?>오리알터광장<?php } ?>
				<?php if($uId) echo " <i class='fa fa-angle-double-right'></i> ".$uInfo['mb_nick'] ?>
			</h2>
			<div id="subBtn">
			<?php if($uId) { ?>
				<button class="btn btn-default showSub" id="profile"><i class="fa fa-user"></i></button>
				<button class="btn btn-default showSub" id="cate"><i class="fa fa-list-ul"></i></button>
			<?php } ?>
				<button class="btn btn-default showSub" id="comm"><i class="fa fa-comments"></i></button>
			</div>
			<div id="squareSectBox" class="innerPaging">
				<?php include G5_PATH."/inc_squareSect.php";?>
			</div>
		</div>

<?php
} //$square_id가 없을 때
?>
</div><!-- id="sqCon"-->

<div id="sqSub" class="sqSubAbs">
	<button class="btn btn-default hideSub"><i class="fa fa-times"></i></button>
	<?php
		if($square_id||$uId) {
			if($square_id) {
				$uInfo = get_member($squareWrInfo['mb_id']);
				$p_id = $square_id;
			}
			if($uId) {
				$uInfo = get_member($uId);
				$p_id = $uId;
			}
	?>
	<div id="userBox">
		<div id="writeName">
			<h2><?php echo $uInfo['mb_nick']?></h2>
			<a id="sendMemo" class="btn btn-default btn-xs" href="javascript:;" onclick="window.open('<?php echo G5_BBS_URL?>/memo_form.php?me_recv_mb_id=<?php echo $uInfo['mb_id']?>','name','resizable=no,width=550,height=500,status=no,scrollbars=yes,menubar=no');return false">쪽지보내기</a>
		</div>
		<img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" id="pfLoading" />
		<div id="pfBoxWrap"><?php include G5_PATH."/inc_profile.php"?></div>
	</div>
	<?php if($member['mb_id']==$uInfo['mb_id']) { ?>
	<button class="btn btn-info btn-xs floR marR10" id="mngCate">카테고리 관리</button>
	<?php } ?>
	<div id="sqCate" class="round5">
<?php
$maxWrid = sql_fetch(" select MAX(wr_id) as wr_id from {$square_table} where wr_is_comment = 0 and mb_id = '{$uInfo['mb_id']}' ");
$wrNum = sql_fetch(" select count(wr_id) as num from {$square_table} where wr_is_comment = 0 and mb_id = '{$uInfo['mb_id']}' ");
$allNum = "";
if($wrNum['num']>0) $allNum = " <span class='Corange fs-08 fwB'>".$wrNum['num']."</span>";
?>
		<li rel="전체:<?php echo $uInfo['mb_id']?>:<?php echo $wrNum['num']?>:<?php echo $maxWrid['wr_id']?>:<?php echo $p_id?>:square" class="sqCateList">
			<a class="<?php if(!$sqCate) { ?>selected round5<?php } ?>"><i class="fa fa-list-ul"></i> 전체<?php echo $allNum?> <i class="fa fa-check-square-o checked" id="전체"></i></a>
		</li>
		<?php
		$mbCate = explode(';',$uInfo['mb_2'].';광장');
		$cnt = count($mbCate);
		for($i=0;$i<$cnt;$i++) {
			$maxCate = sql_fetch(" select MAX(wr_id) as wr_id from {$square_table} where ca_name = '{$mbCate[$i]}' and wr_is_comment = 0 and mb_id = '{$uInfo['mb_id']}' ");
			$selected = '';
			$squareId = $maxCate['wr_id'];
			if($sqCate==$mbCate[$i])
			{
				$selected = 'selected round5';
				$squareId = $p_id;
			}
			$cateNum = sql_fetch(" select count(wr_id) as num from {$square_table} where wr_is_comment = 0 and mb_id = '{$uInfo['mb_id']}' and ca_name = '{$mbCate[$i]}' ");
			$caNum = "";
			if($cateNum['num']>0) $caNum = " <span class='Corange fs-08 fwB'>".$cateNum['num']."</span>";
			if($mbCate[$i]!='') {
		?>
		<li rel="<?php echo $mbCate[$i]?>:<?php echo $uInfo['mb_id']?>:<?php echo $cateNum['num']?>:<?php echo $squareId?>:<?php echo $square_id?>:square" class="sqCateList round5">
			<a class="<?php echo $selected?>"><i class="fa fa-list-ul"></i> <?php echo $mbCate[$i].$caNum?> <i class="fa fa-check-square-o checked" id="<?php echo $mbCate[$i]?>"></i></a>
		</li>
		<?php } } ?>
		<div id="sqCateListWrap" class="<?php if(!G5_IS_MOBILE) { ?>sqCateListWrapAbs1<?php } else { ?>sqCateListWrapAbs2<?php } ?> round5">
			<button class="btn btn-default btn-sm" id="hide-sqCateList"><i class="fa fa-times"></i></button>
			<div id="sqCateListBox" class="cL innerPaging padd10 cateListBox">
				<?php include G5_PATH."/inc_sqCateList.php";?>
			</div>
		</div>
	</div>
	<?php } ?>
	<div id="commentsBox">
		<h3 id="sub-title"><i class="fa fa-comments fa-2x"></i> 광장 전체 댓글</h3>
		<div id="commentsBoxWrap" class="commList">
			<?php include G5_PATH."/inc_commentBox.php";?>
		</div>
	</div>
</div><!-- id="sqSub"-->

<?php
include_once(G5_PATH.'/_tail.php');
?>