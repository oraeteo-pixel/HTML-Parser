<?php
define('_NOTICE_', true);
include_once('./_common.php');
include_once(G5_PATH.'/_head.php');

if($no_id) {
?>

<div id="noticeL" class="noticeL">
<?php
// 수정, 삭제 링크
$update_href = $delete_href = '';
// 로그인중이고 자신의 글이라면 또는 관리자라면 패스워드를 묻지 않고 바로 수정, 삭제 가능
if (($member['mb_id']&&($member['mb_id']==$noWrInfo['mb_id']))||$is_admin) {
    $update_href = G5_BBS_URL.'/write.php?w=u&amp;bo_table=notice&amp;wr_id='.$no_id.'&amp;page='.$page;
    $delete_href = G5_BBS_URL.'/delete.php?bo_table=notice&amp;wr_id='.$no_id.'&amp;page='.$page;
/*
    if ($is_admin)
    {
//        set_session("ss_delete_token", $token = uniqid(time()));
		$token = get_session('ss_delete_token');
        $delete_href = G5_BBS_URL.'/delete.php?bo_table=square&amp;wr_id='.$square_id.'&amp;token='.$token.'&amp;page='.$page;
    }
*/
}
	$commentNum = "";
	if($noWrInfo['wr_comment']>0) $commentNum = "<span class='comment-num'>".$noWrInfo['wr_comment']."</span>";
	$rowDatetime10 = substr($noWrInfo['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = substr($noWrInfo['wr_datetime'],11,8);
	else
		$rowDatetime = $rowDatetime10;
	?>
	
	<h2 class="round5"><i class="fa fa-bullhorn"></i> 오리알터닷컴 공지</h2>
	<div id="title">
		<h1 id="subject"><?php echo $noWrInfo['wr_subject']?></h1>
		<span id="name">관리자<?php // echo $noWrInfo['wr_name']?></span>
		<a class="btn btn-default btn-xs" href="javascript:;" onclick="window.open('<?php echo G5_BBS_URL?>/memo_form.php?me_recv_mb_id=<?php echo $noWrInfo['mb_id']?>','name','resizable=no,width=550,height=500,status=no,scrollbars=yes,menubar=no');return false"><i class="fa fa-envelope-o"></i> 쪽지</a>
		<span id="dateTime"><?php echo $rowDatetime?></span>
		<span class="wrHit round5"><?php echo number_format($noWrInfo['wr_hit'])?></span>
	</div>
	<div id="sqContent" class="marT30">
	<?php echo $noWrInfo['wr_content']?>
	</div>
	<div class='toolBox marT30'>
	<?php if($member['mb_id']==$sectWrInfo['mb_id']||$is_admin=='super') { ?>
		<a class='btn btn-success' type='button' href='<?php echo $update_href?>'>수정</a>
		<a class='btn btn-danger' type='button' href='<?php echo $delete_href?>' onclick='del(this.href); return false;'>삭제</a>
	<?php } ?>
		<div class="padd10 txtR">
			<button type="button" class="btn btn-default openCommentBox" id="openCommentBox2" rel="notice:<?php echo $no_id?>"><i class="fa fa-comment fa-2x"></i> <span class='commentNum' id='wrId<?php echo $no_id?>'><?php echo $commentNum?></span></button>
		</div>
	</div>
	<div class="txtC padd10 cl-bo dispN" id="iconLoading"><img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" /></div>
	<div id="wrCommentsBox" class="cl-bo<?php if($mode=='openComment') { ?> open<?php } ?>">
		<?php if($mode=='openComment') include G5_PATH."/inc_commentList.php" ?>
	</div>
<?php
//조회수 증가
$ss_name = 'ss_view_square_'.$no_id;
if (!get_session($ss_name))
{
	sql_query(" update {$notice_table} set wr_hit = wr_hit + 1 where wr_id = '{$no_id}' ");
	// 자신의 글이면 통과
	if ($noWrInfo['mb_id']&&$noWrInfo['mb_id'] == $member['mb_id']) {
	;
	} else if ($is_guest&&$noWrInfo['wr_ip']==$_SERVER['REMOTE_ADDR']) {
	// 비회원이면서 등록된 아이피가 같다면 자신의 글이므로 통과
	;
	}
	set_session($ss_name, TRUE);
}
?>
</div>

<div id="noticeR" class="noticeRAbs">
	<div id="subjListBoxWrap">
		<h2><i class="fa fa-bullhorn"></i> 공지 전체 글</h2>
		<img src="<?php echo G5_IMG_URL?>/ajaxLoader.gif" id="subjListLoading" />
		<div id="subjListBox" class="innerPaging">
		<?php include G5_PATH."/inc_subjList.php";?>
		</div>
	</div>
	<div id="commentsBox">
		<h3 id="sub-title"><i class="fa fa-bullhorn fa-2x"></i> 공지 전체 댓글</h3>
		<div id="commentsBoxWrap" class="commList">
			<?php include G5_PATH."/inc_commentBox.php";?>
		</div>
	</div>
</div>

<?php
}
include_once(G5_PATH.'/_tail.php');
?>