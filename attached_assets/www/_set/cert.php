<?php
include_once('./_common.php');

 if(!$is_member&&!$_SESSION['sses_social_user']['email']) alert('접속권한이 없습니다.');

include_once(G5_LIB_PATH.'/register.lib.php');
include_once(G5_PATH.'/_head.php');
$register_action_url = G5_HTTPS_BBS_URL.'/register_form_update.php';
$ip_info = explode('.',$_SERVER['REMOTE_ADDR']);
$ip_str = $ip_info[0].$ip_info[1].$ip_info[2].$ip_info[3];
$ip_str = substr($ip_str,0,10);
$id_str = G5_SERVER_TIME + $ip_str;
if($w=='u')$mb_id = $member['mb_id'];
else $mb_id = "ort".$id_str;

$pw = substr($_SESSION['ss_mb_key'],0,6);
$email = $_SESSION['sses_social_user']['email'];

?>
<br />
<div class="alert alert-success">
<?php
if($mode=='login_result') {
?>

<?php echo $member['mb_nick']?>님, 오리알터.com에 로그인되셨습니다.<br />
<br />
<?php if($_SESSION['ss_is_mobile']!='1') { ?>
<div class="alert alert-warning">
현재 사용 중인 PC가 피시방 등의 공용PC라면 이 사이트와
연동과정에서 로그인되어 있을 <code class='ff-ng fs-12'>구글계정을 반드시 로그아웃</code>하시기 바랍니다.<br />
<br />
그리고 오리알터.com을 나가실 때에도 반드시 로그아웃 혹은 접속 중인 브라우저를 닫으시기 바랍니다.<br />
<br />
그럼 유익한 시간 되세요^^
</strong>
</div>
<?php } ?>
<a href='<?php echo G5_URL?>' class="btn btn-success btn-lg" role="button">메인으로 가기</a>

<?php } else if($mode=='reg') { ?>

	<?php if($w=='u') { ?>
	<h1 class='ff-ng'>회원정보 수정</h1>
	<?php } else { ?>
	<h1 class='ff-ng'>회원 가입</h1>
반갑습니다. <?php echo $so_name?>님.<br />
이제 오리알터.com에서 사용할 필명만 등록하시면 <strong><u>가입이 완료</u></strong>됩니다.<br />
	<?php } ?>
<br />

<?php if($w!='u') { ?>
<div class="alert alert-warning">
<strong>
필독!!! 현재 사용 중인 PC가 피시방 등의 공용PC라면 이 사이트와
연동과정에서 로그인되어 있을 <code class='ff-ng fs-12'>구글계정을 반드시 로그아웃</code>하시기 바랍니다.<br />
</strong><br />
만약 가입을 원치 않으시면 현재 오리알터.com에 연동되어 있는 <?php echo $so_name?>님의 구글계정 정보도
연동해제하시기 바랍니다. 이것은 <?php echo $so_name?>님의 개인정보보호를 위해서입니다. 물론 구글계정에는 아무런
영향을 미치지 않으며 언제든지 재가입도 가능합니다.<br />
<br />
<a href='./?mode=session_unset' class="btn btn-danger btn-xs" role="button">가입하지 않고 구글계정 연동해제</a><br />
</div>
<?php } ?>

<?php ///별명수정일이 지나지 않았다면
$disabled_mod = "";
$disabled_msg = "";
if ($member['mb_nick_date'] > date("Y-m-d", G5_SERVER_TIME - ($config['cf_nick_modify'] * 86400)))
{
$disabled_mod = " disabled='disabled'";
$disabled_msg = "필명은 등록 후 ".$config['cf_nick_modify']."일 지나서 수정가능합니다.";
}
?>


<div class="row">
  <div class="col-md-8 col-md-offset-2">
  <?php if($w!='u') { ?>원하시는 필명을 입력하신 후 필명 등록을 하시면 가입이 완료됩니다.<?php } ?>
    <form id="fregisterform" name="fregisterform" action="<?php echo $register_action_url ?>" onsubmit="return fregisterform_submit(this);" method="post" enctype="multipart/form-data" autocomplete="off">
    <input type="hidden" name="w" value="<?php echo $w ?>">
    <input type="hidden" name="mb_id" value="<?php echo $mb_id ?>">
	<input type="hidden" name="mb_password" value="<?php echo $pw?>">
	<input type="hidden" name="mb_password_re" value="<?php echo $pw?>">
	<input type="hidden" name="mb_email" value="<?php echo isset($member['mb_email'])?$member['mb_email']:$email; ?>">
	<div class="input-group">
	<input type="text" class="form-control" name="mb_nick" value="<?php echo isset($member['mb_nick'])?$member['mb_nick']:$so_name; ?>" required size="10" maxlength="20" placeholder='공백없이 필명을 입력하세요'<?php echo $disabled_mod?>>
	<span class="input-group-btn">
		<button class="btn btn-primary" type="submit"<?php echo $disabled_mod?>><?php if($w=='u') { ?>필명 수정<?php } else { ?>필명 등록<? } ?></button>
	</span>
	</div><!-- /input-group -->
		<?php if($w!='u') { ?><small>미리 입력되어 있는 <b>'<?php echo $so_name?>'</b>는(은) 구글계정에서 사용 중이신 닉네임입니다.</small><?php } ?>
		<?php if($w=='u') echo "<small>".$disabled_msg."</small>"; ?>
	</form>
  </div>
</div><!-- /.row -->
<br />

<?php } ?>
</div>

<?php
include_once(G5_PATH.'/_tail.php');
?>