<?php
include_once('./_common.php');
include_once('./_head.php');
?>
<div id="mb_login">

	<form name="flogin" action="<?php echo G5_HTTPS_BBS_URL."/login_check.php";?>" onsubmit="return flogin_submit(this);" method="post">
		<input type="text" name="mb_nick" required class="form-control" size="20" maxLength="20" placeholder="회원별명">
		<input type="password" name="mb_password" required class="form-control" size="20" maxLength="20" placeholder="비밀번호">
		<button type="submit" class="btn btn-primary"> 로그인 </button>
		<label><input type="checkbox" name="auto_login"> 자동로그인</label>
	</form>

	<div>
		<a href="<?php echo G5_BBS_URL ?>/password_lost.php" target="win_password_lost" id="login_password_lost" class="btn02">별명/패스워드 찾기</a>
		<a href="./register_form.php" class="btn01">회원 가입</a>
	</div>
	
<script src="<?php echo G5_JS_URL ?>/jquery.register_form.js"></script>

<form id="fregisterform" name="fregisterform" action="<?php echo G5_HTTPS_BBS_URL.'/register_form_update.php'; ?>" onsubmit="return fregisterform_submit(this);" method="post" enctype="multipart/form-data" autocomplete="off">
<input type="hidden" name="w" value="<?php echo $w ?>">
<input type="hidden" name="url" value="<?php echo $urlencode ?>">
<input type="hidden" name="agree" value="<?php echo $agree ?>">
<input type="hidden" name="agree2" value="<?php echo $agree2 ?>">
<input type="hidden" name="cert_type" value="<?php echo $member['mb_certify']; ?>">
<?php if (isset($member['mb_sex'])) {  ?><input type="hidden" name="mb_sex" value="<?php echo $member['mb_sex'] ?>"><?php }  ?>
<?php if (isset($member['mb_nick_date']) && $member['mb_nick_date'] > date("Y-m-d", G5_SERVER_TIME - ($config['cf_nick_modify'] * 86400))) { // 별명수정일이 지나지 않았다면  ?>
<input type="hidden" name="mb_nick_default" value="<?php echo $member['mb_nick'] ?>">
<input type="hidden" name="mb_nick" value="<?php echo $member['mb_nick'] ?>">
<?php }  ?>
<input type="hidden" name="mb_1" value="<?php echo $member['mb_1']?>">
<input type="hidden" name="mb_2" value="<?php echo $member['mb_2']?>">
<input type="hidden" name="mb_3" value="<?php echo $member['mb_3']?>">
<input type="hidden" name="mb_4" value="<?php echo $member['mb_4']?>">
<input type="hidden" name="mb_5" value="<?php echo $member['mb_5']?>">
<input type="hidden" name="mb_6" value="<?php echo $member['mb_6']?>">
<input type="hidden" name="mb_7" value="<?php echo $member['mb_7']?>">
<input type="hidden" name="mb_8" value="<?php echo $member['mb_8']?>">
<input type="hidden" name="mb_9" value="<?php echo $member['mb_9']?>">
<input type="hidden" name="mb_10" value="<?php echo $member['mb_10']?>">

<table class="table">
<?php
$ip_info = explode('.',$_SERVER['REMOTE_ADDR']);
$ip_str = $ip_info[0].$ip_info[1].$ip_info[2].$ip_info[3];
$ip_str = substr($ip_str,0,10);
$id_str = G5_SERVER_TIME + $ip_str;
if($w=='u')$mb_id = $member['mb_id'];
else $mb_id = "ort".$id_str;
?>
<input type="hidden" name="mb_id" value="<?=$mb_id?>">

<tr>
    <td>
		<li class='Ccrimson'>별명은 <b>한글</b>, 영문, 숫자 모두 가능합니다.</li>
        <li>
            공백없이 한글, 영문, 숫자만 입력 가능 (한글2자, 영문4자 이상)<br>
            별명을 바꾸시면 앞으로 <?php echo (int)$config['cf_nick_modify'] ?>일 이내에는 변경 할 수 없습니다.
        </li>
        <input type="hidden" name="mb_nick_default" value="<?php echo isset($member['mb_nick'])?$member['mb_nick']:''; ?>">
        <input type="text" name="mb_nick" value="<?php echo isset($member['mb_nick'])?$member['mb_nick']:''; ?>" required class="form-control required nospace" size="30" maxlength="30" placeholder="회원별명을 입력하세요.">
        <span id="msg_mb_nick"></span>
    </td>
</tr>
<tr>
    <td>
		<input type="password" name="mb_password" <?php echo $required ?> class="form-control minlength_3 <?php echo $required ?>" size="30" maxlength="30" placeholder="비밀번호를 입력하세요."><br />
		<input type="password" name="mb_password_re" <?php echo $required ?> class="form-control minlength_3 <?php echo $required ?>" size="30" maxlength="30" placeholder="비밀번호를 한번 더 입력하세요.">
	</td>
</tr>
<tr>
    <td>
        <?php if ($config['cf_use_email_certify']) {  ?>
        <span class="frm_info">
            <?php if ($w=='') { echo "E-mail 로 발송된 내용을 확인한 후 인증하셔야 회원가입이 완료됩니다."; }  ?>
            <?php if ($w=='u') { echo "E-mail 주소를 변경하시면 다시 인증하셔야 합니다."; }  ?>
        </span>
        <?php }  ?>
        <input type="hidden" name="old_email" value="<?php echo $member['mb_email'] ?>">
        <input type="email" name="mb_email" value="<?php echo isset($member['mb_email'])?$member['mb_email']:''; ?>" required class="form-control email required" size="50" maxlength="100" placeholder="이메일을 입력하세요."><br />
		이메일은 비밀번호 분실시 본인확인용으로도 쓰이므로 가급적 사용가능한 이메일을 입력하시기 바랍니다.<br />
		물론 본 사이트 외부에는 어떤 용도로도 유출되지 않습니다.
    </td>
</tr>

<tr>
    <th scope="row">자동등록방지</th>
    <td><?php echo $captcha_html ?></td>
</tr>

</table>

<table class="table">
<caption>기타 개인설정</caption>
<?php if ($config['cf_use_signature']) {  ?>
<tr>
    <th scope="row"><label for="reg_mb_signature">서명<?php if ($config['cf_req_signature']){ ?><strong class="sound_only">필수</strong><?php } ?></label></th>
    <td><textarea name="mb_signature" id="reg_mb_signature" <?php echo $config['cf_req_signature']?"required":""; ?> class="<?php echo $config['cf_req_signature']?"required":""; ?>"><?php echo $member['mb_signature'] ?></textarea></td>
</tr>
<?php }  ?>

<?php if ($config['cf_use_profile']) {  ?>
<tr>
    <th scope="row"><label for="reg_mb_profile">자기소개</label></th>
    <td><textarea name="mb_profile" id="reg_mb_profile" <?php echo $config['cf_req_profile']?"required":""; ?> class="<?php echo $config['cf_req_profile']?"required":""; ?>"><?php echo $member['mb_profile'] ?></textarea></td>
</tr>
<?php }  ?>

<?php if ($config['cf_use_member_icon'] && $member['mb_level'] >= $config['cf_icon_level']) {  ?>
<tr>
    <th scope="row"><label for="reg_mb_icon">회원아이콘</label></th>
    <td>
        <span class="frm_info">
            이미지 크기는 가로 <?php echo $config['cf_member_icon_width'] ?>픽셀, 세로 <?php echo $config['cf_member_icon_height'] ?>픽셀 이하로 해주세요.<br>
            gif만 가능하며 용량 <?php echo number_format($config['cf_member_icon_size']) ?>바이트 이하만 등록됩니다.
        </span>
        <input type="file" name="mb_icon" id="reg_mb_icon" class="frm_input">
        <?php if ($w == 'u' && file_exists($mb_icon)) {  ?>
        <input type="checkbox" name="del_mb_icon" value="1" id="del_mb_icon">
        <label for="del_mb_icon">삭제</label>
        <?php }  ?>
    </td>
</tr>
<?php }  ?>

<tr>
    <th scope="row"><label for="reg_mb_mailling">메일링서비스</label></th>
    <td>
        <input type="checkbox" name="mb_mailling" value="1" id="reg_mb_mailling" <?php echo ($w=='' || $member['mb_mailling'])?'checked':''; ?>>
        정보 메일을 받겠습니다.
    </td>
</tr>

<?php if ($config['cf_use_hp']) {  ?>
<tr>
    <th scope="row"><label for="reg_mb_sms">SMS 수신여부</label></th>
    <td>
        <input type="checkbox" name="mb_sms" value="1" id="reg_mb_sms" <?php echo ($w=='' || $member['mb_sms'])?'checked':''; ?>>
        휴대폰 문자메세지를 받겠습니다.
    </td>
</tr>
<?php }  ?>

<?php if (isset($member['mb_open_date']) && $member['mb_open_date'] <= date("Y-m-d", G5_SERVER_TIME - ($config['cf_open_modify'] * 86400)) || empty($member['mb_open_date'])) { // 정보공개 수정일이 지났다면 수정가능  ?>
<tr>
    <th scope="row"><label for="reg_mb_open">정보공개</label></th>
    <td>
        <span class="frm_info">
            정보공개를 바꾸시면 앞으로 <?php echo (int)$config['cf_open_modify'] ?>일 이내에는 변경이 안됩니다.
        </span>
        <input type="hidden" name="mb_open_default" value="<?php echo $member['mb_open'] ?>">
        <input type="checkbox" name="mb_open" value="1" <?php echo ($w=='' || $member['mb_open'])?'checked':''; ?> id="reg_mb_open">
        다른분들이 나의 정보를 볼 수 있도록 합니다.
    </td>
</tr>
<?php } else {  ?>
<tr>
    <th scope="row">정보공개</th>
    <td>
        <span class="frm_info">
            정보공개는 수정후 <?php echo (int)$config['cf_open_modify'] ?>일 이내, <?php echo date("Y년 m월 j일", isset($member['mb_open_date']) ? strtotime("{$member['mb_open_date']} 00:00:00")+$config['cf_open_modify']*86400:G5_SERVER_TIME+$config['cf_open_modify']*86400); ?> 까지는 변경이 안됩니다.<br>
            이렇게 하는 이유는 잦은 정보공개 수정으로 인하여 쪽지를 보낸 후 받지 않는 경우를 막기 위해서 입니다.
        </span>
        <input type="hidden" name="mb_open" value="<?php echo $member['mb_open'] ?>">
    </td>
</tr>
<?php }  ?>

<?php if ($w == "" && $config['cf_use_recommend']) {  ?>
<tr>
    <th scope="row"><label for="reg_mb_recommend">추천인아이디</label></th>
    <td><input type="text" name="mb_recommend" id="reg_mb_recommend" class="frm_input"></td>
</tr>
<?php }  ?>

</table>

    <button type="submit" class="btn btn-primary" accesskey="s"><?php echo $w==''?'회원가입':'정보수정'; ?></button>
    <a href="<?php echo G5_URL ?>" class="btn btn-danger">취소(메인으로 가기)</a>
</form>

<?php
if ($config['cf_cert_use']) {
    // KCP 휴대폰인증 form
    if($config['cf_cert_hp'] == 'kcp')
        include_once(G5_KCPCERT_PATH.'/kcpcert_form.php');
}
?>
</div>
<script>
$(function(){
    $("#login_auto_login").click(function(){
        if (this.checked) {
            this.checked = confirm("자동로그인을 사용하시면 다음부터 회원아이디와 패스워드를 입력하실 필요가 없습니다.\n\n공공장소에서는 개인정보가 유출될 수 있으니 사용을 자제하여 주십시오.\n\n자동로그인을 사용하시겠습니까?");
        }
    });
});

function flogin_submit(f)
{
    return true;
}

$(function() {
    $("#reg_zip_find").css("display", "inline-block");
    $("#reg_mb_zip1, #reg_mb_zip2, #reg_mb_addr1").attr("readonly", true);

    <?php if($config['cf_cert_use']) { ?>

    <?php if($config['cf_cert_ipin'] == 'kcb') { ?>
    // KCB 아이핀인증
    $("#win_ipin_cert").click(function() {
        if(!cert_confirm())
            return false;

        var url = "<?php echo G5_OKNAME_URL; ?>/ipin1.php";
        var popupWindow = window.open( url, "kcbPop", "left=200, top=100, status=0, width=450, height=550" );
        popupWindow.focus();
        return;
    });
    <?php } ?>

    <?php if($config['cf_cert_hp'] == 'kcb') { ?>
    // KCB 휴대폰인증
    $("#win_hp_cert").click(function() {
        if(!cert_confirm())
            return false;

        var url = "<?php echo G5_OKNAME_URL; ?>/hpcert1.php";
        var popupWindow = window.open( url, "auth_popup", "left=200, top=100, width=430, height=590, scrollbar=yes" );
        popupWindow.focus();
        return;
    });
    <?php } ?>

    <?php if($config['cf_cert_hp'] == 'kcp') { ?>
    // KCP 휴대폰인증
    $("#win_hp_cert").click(function() {
        if(!cert_confirm())
            return false;

        auth_type_check($("#reg_mb_name").val());
        return false;
    });
    <?php } ?>

    <?php } ?>
});

// 인증체크
function cert_confirm()
{
    var val = document.fregisterform.cert_type.value;
    var type;

    switch(val) {
        case "ipin":
            type = "아이핀";
            break;
        case "hp":
            type = "휴대폰";
            break;
        default:
            return true;
    }

    if(confirm("이미 "+type+" 본인확인을 완료하셨습니다.\n\n이전 인증을 취소하고 다시 인증하시겠습니까?"))
        return true;
    else
        return false;
}

// submit 최종 폼체크
function fregisterform_submit(f)
{
    // 회원아이디 검사
    if (f.w.value == "") {
        var msg = reg_mb_id_check();
        if (msg) {
            alert(msg);
            f.mb_id.select();
            return false;
        }
    }

    if (f.w.value == "") {
        if (f.mb_password.value.length < 3) {
            alert("패스워드를 3글자 이상 입력하십시오.");
            f.mb_password.focus();
            return false;
        }
    }

    if (f.mb_password.value != f.mb_password_re.value) {
        alert("패스워드가 같지 않습니다.");
        f.mb_password_re.focus();
        return false;
    }

    if (f.mb_password.value.length > 0) {
        if (f.mb_password_re.value.length < 3) {
            alert("패스워드를 3글자 이상 입력하십시오.");
            f.mb_password_re.focus();
            return false;
        }
    }

    // 이름 검사
    if (f.w.value=="") {
        if (f.mb_name.value.length < 1) {
            alert("이름을 입력하십시오.");
            f.mb_name.focus();
            return false;
        }

        /*
        var pattern = /([^가-힣\x20])/i;
        if (pattern.test(f.mb_name.value)) {
            alert("이름은 한글로 입력하십시오.");
            f.mb_name.select();
            return false;
        }
        */
    }

    // 별명 검사
    if ((f.w.value == "") || (f.w.value == "u" && f.mb_nick.defaultValue != f.mb_nick.value)) {
        var msg = reg_mb_nick_check();
        if (msg) {
            alert(msg);
            f.reg_mb_nick.select();
            return false;
        }
    }

    // E-mail 검사
    if ((f.w.value == "") || (f.w.value == "u" && f.mb_email.defaultValue != f.mb_email.value)) {
        var msg = reg_mb_email_check();
        if (msg) {
            alert(msg);
            f.reg_mb_email.select();
            return false;
        }
    }

    if (typeof f.mb_icon != "undefined") {
        if (f.mb_icon.value) {
            if (!f.mb_icon.value.toLowerCase().match(/.(gif)$/i)) {
                alert("회원아이콘이 gif 파일이 아닙니다.");
                f.mb_icon.focus();
                return false;
            }
        }
    }

    if (typeof(f.mb_recommend) != "undefined" && f.mb_recommend.value) {
        if (f.mb_id.value == f.mb_recommend.value) {
            alert("본인을 추천할 수 없습니다.");
            f.mb_recommend.focus();
            return false;
        }

        var msg = reg_mb_recommend_check();
        if (msg) {
            alert(msg);
            f.mb_recommend.select();
            return false;
        }
    }

    <?php echo chk_captcha_js();  ?>

    document.getElementById("btn_submit").disabled = "disabled";

    return true;
}
</script>
<!-- } 회원정보 입력/수정 끝 -->
	
	
<?php
include_once('./_head.php');
?>