<?php
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 
$prefix = "picasa_";
?>
<style>
    ul.config_form_list li label.<?php echo $prefix; ?>lb{display:inline-block;width:80px; }
    .<?php echo $prefix; ?>descr{color:#888;}
    .<?php echo $prefix; ?>push{margin-left:80px;}
</style>
<form name="slsfrm" method="post" action="admin_do.php">
    <input type="hidden" name="bo_table" value="<?php echo $GLOBALS['bo_table']; ?>"/>
    <input type="hidden" name="gr_id" value="<?php echo $GLOBALS['gr_id']; ?>"/>
    <input type="hidden" name="id" value="<?php echo $plugin_id; ?>"/>
    <input type="hidden" name="act" value="picasa_save_setting"/>
    <input type="hidden" name="w" value="u"/>

    <ul class="config_form_list">
        <li>
            <label class="sly_lb">이메일</label>
            <input type="text" size="40" name="plugin_config[email]" id="sly_email" value="<?= htmlspecialchars($plugin_config['email']) ?>"/>
            <span class="descr">구글 이메일 주소</span>
        </li>
        <li>
            <label class="sly_lb">패스워드</label>
            <input type="password" size="40" id="sly_passwd" name="plugin_config[passwd]" value="<?= htmlspecialchars($plugin_config['passwd']) ?>"/>
            <span class="descr">구글 패스워드</span> 
        </li>
        <li>
            <label class="sly_lb">기본썸네일</label>
            <select name="plugin_config[view_thumb]">
            <option value="thumb1"<?php if($plugin_config['view_thumb'] == 'thumb1') echo ' selected'; ?>>작은 썸네일</option>
            <option value="thumb2"<?php if($plugin_config['view_thumb'] == 'thumb2') echo ' selected'; ?>>중간 썸네일</option>
            <option value="thumb3"<?php if($plugin_config['view_thumb'] == 'thumb3') echo ' selected'; ?>>큰 썸네일</option>
            <option value="origin"<?php if($plugin_config['view_thumb'] == 'origin') echo ' selected'; ?>>원본</option>
            </select>
            <span class="descr">뷰페이지의 기본 썸네일 크기</span> 
        </li>
        <li class="push">
            <input type="submit" class="gp_btn" value="설정 저장"/>
        </li>
    </ul>

</form>
