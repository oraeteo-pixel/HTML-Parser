<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 
include_once G5_PATH."/head.php";
?>

<div id='frmsignup'>
<form  name='frmsignup' action='<?php echo GP_URL;?>/do.php' method='post' onsubmit='return check_form(this);'>

	<input type='hidden' name='id' value='<?php echo $this->id; ?>'/>
	<input type='hidden' name='act' value='sociallogin'/>
	<input type='hidden' name='s' value='signup_proc_exe'/>
	<input type='hidden' name='mb_homepage' value='<?=htmlspecialchars($social_user['homepage'])?>'/>

	<h3>소셜 네트워크 로그인</h3>

	<p style="margin-top:20px;padding:0 10px; line-height:100%">
		사이트 회원으로 등록 시 소셜 로그인이 아닌 등록 계정으로도 로그인 하실 수 있습니다. 
		<label for="make_id" style="margin:8px 0 0 0;padding:0;"><input type="checkbox" value=1 name="make_gnu_id" id="make_id"> 사이트 회원으로 등록합니다.</label>
	</p>

  <h4>기본 정보</h4>

  <div>
    <label for="reg_name">이름 (공백없이 한글만):</label>
    <input type="text" id="reg_name" name="mb_name" value="<?=htmlspecialchars($social_user['name'])?>" class='input_text' required itemname="이름"/>
  </div>

  <div>
    <label for="reg_email">이메일:</label>
    <input type="text" id="reg_email" name="mb_email" value="<?=htmlspecialchars($social_user['email'])?>" class='input_text' required itemname='이메일' <? if($social_user['email']) echo "readonly"; ?>/>
  </div>

	<div id="form_make_id" style="display:none">
    <h4>회원가입 정보</h4>
		<div>
			<label for="reg_id">아이디 (영문자, 숫자, _ 만 입력 가능. 최소 3자이상):</label>
			<input type="text" id="reg_id" name="mb_id" class='input_text' itemname='아이디'/>
		</div>
		<div>
			<label for="reg_nick">별명 (공백없이 한글,영문,숫자만 (한글2자, 영문4자 이상)):</label>
			<input type="text" id="reg_nick" name="mb_nick" value="<?=htmlspecialchars($social_user['nickname'])?>" class='input_text'/>
		</div>
		<div>
			<label for="reg_passwd">패스워드:</label>
			<input type="password" id="reg_passwd" name="mb_password"  class='input_text' itemname='패스워드'/>
		</div>
		<div>
			<label for="reg_passwd_re">패스워드확인:</label>
			<input type="password" id="reg_passwd_re" name="mb_password_re" class='input_text' itemname='패스워드확인' />
		</div>
	</div>

	<h4>회원가입약관</h4>
	<div>
		<textarea readonly ><?=get_text($config['cf_stipulation'])?></textarea>
		<div class="agree">
			<input type=radio value=1 name=agree id=agree11>&nbsp;<label for=agree11>동의합니다.</label>
			<input type=radio value=0 name=agree id=agree10>&nbsp;<label for=agree10>동의하지 않습니다.</label>
		</div>
	</div>

	<h4>개인정보취급방침</h4>
	<div>
		<textarea readonly ><?=get_text($config['cf_privacy'])?></textarea>
		<div class="agree">
			<input type=radio value=1 name=agree2 id=agree21>&nbsp;<label for=agree21>동의합니다.</label>
			<input type=radio value=0 name=agree2 id=agree20>&nbsp;<label for=agree20>동의하지 않습니다.</label>
		</div>
	</div>
	<div class="bottom clearfix">
		<input type="submit" class="input_submit" value="로그인" />
	</div>

</form>
</div>

<script type="text/javascript">
$(document).ready(function() {
	$('#make_id').click(function() {
		if($(this).is(":checked")) $('#form_make_id').show();
		else $('#form_make_id').hide();
	});
});
function check_form(f) 
{
  if($('#make_id').is(':checked')) {
    if($('#reg_id').val() == '')
    {
      alert('아이디를 입력하세요');
      $('#reg_id').focus();
      return false;
    }
    if($('#reg_name').val() == '')
    {
      alert('이름을 입력하세요');
      $('#reg_name').focus();
      return false;
    }
    if($('#reg_nick').val() == '')
    {
      alert('별명을 입력하세요');
      $('#reg_nick').focus();
      return false;
    }
    if($('#reg_passwd').val() != $('#reg_passwd_re').val()) 
    {
      alert('패스워드가 일치하지 않습니다.');
      return false;
    }
  }

  var agree1 = document.getElementsByName("agree");
  if (!agree1[0].checked) {
      alert("회원가입약관의 내용에 동의하셔야 회원가입 하실 수 있습니다.");
      agree1[0].focus();
      return false;
  }

  var agree2 = document.getElementsByName("agree2");
  if (!agree2[0].checked) {
      alert("개인정보취급방침의 내용에 동의하셔야 회원가입 하실 수 있습니다.");
      agree2[0].focus();
      return false;
  }
  return true;
}
</script>

<style type="text/css">
	#frmsignup { background:#fff; margin:0 auto; width:95%; }
	#frmsignup h3 { margin:0; padding:10px; color:#333; font-size:16pt; border-bottom:2px solid #888; }
	#frmsignup h4 { margin:30px 0 0 0;  padding-left:10px; }
	#frmsignup label { display:block; padding:5px 10px; margin:10px 0px 0px 0px; }
	#frmsignup .input_text { border: solid 1px #E5E5E5; background: #FFFFFF; margin: 0px 0px 0px 10px; padding: 0 5px; display:block; font-size:16px; line-height:30px; height:30px; width:100%; }
	#frmsignup .input_text:focus { background:#feffef; }
	#frmsignup textarea { border: solid 1px #E5E5E5; background: #FFFFFF; margin: 10px 0px 0px 10px; padding: 0 5px; display:block; height:100px; width:100%; }
	#frmsignup .agree { text-align:center; margin-bottom:10px; }
	#frmsignup .agree label { display:inline; }
	#frmsignup .bottom { padding:5px 0; border-top:1px solid #eee; margin-top:20px; clear:both; color:#fff; width:100%; text-shadow:1px 1px 1px #000; text-align:center;}
	#frmsignup .input_submit { background: #e3e3e3; border: 1px solid #ccc; color: #333; font-family: "Trebuchet MS", "Myriad Pro", sans-serif; font-size: 14px; font-weight: bold; padding: 8px 0 9px; text-align: center; width: 150px; cursor:pointer; margin:15px 0px 10px 10px; }
	#frmsignup .input_submit:hover { background: #bbb; color: #222; }
</style>

<? include_once G5_PATH."/tail.php"; ?>
