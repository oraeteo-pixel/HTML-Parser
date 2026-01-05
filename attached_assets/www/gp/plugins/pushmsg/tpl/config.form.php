<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 
$prefix = "pushmsg_";
?>
<style>
  ul.config_form_list li label.<?php echo $prefix;?>lb{display:inline-block;width:80px; }
  .<?php echo $prefix;?>descr{color:#888;}
  .<?php echo $prefix;?>push{margin-left:80px;}
</style>
<form name="slsfrm" method="post" action="admin_do.php">
	<input type="hidden" name="bo_table" value="<?=$GLOBALS['bo_table']?>"/>
	<input type="hidden" name="gr_id" value="<?=$GLOBALS['gr_id']?>"/>
	<input type="hidden" name="id" value="<?=$plugin_id?>"/>
	<input type="hidden" name="act" value="psm_save_setting"/>
	<input type="hidden" name="w" value="u"/>

	<ul class="config_form_list">
		<li>
      <label class="<?php echo $prefix;?>lb">유저명</label>
      <select name="plugin_config[uid]">
      <option value="mb_id"<?php echo ($plugin_config['uid'] == 'mb_id' ? ' selected' : '');?>>아이디</option>
      <option value="mb_name"<?php echo ($plugin_config['uid'] == 'mb_name' ? ' selected' : '');?>>이름</option>
      <option value="mb_nick"<?php echo ($plugin_config['uid'] == 'mb_nick' ? ' selected' : '');?>>별명</option>
      </select>
      <span class="<?php echo $prefix;?>descr">알리미의 사용자 출력 시 사용할 필드</span>
    </li>
    <li class="<?php echo $prefix;?>push">
			<input type="submit" class="gp_btn" value="설정 저장"/>
		</li>
	</ul>

</form>
