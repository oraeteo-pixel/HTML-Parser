<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 
$prefix = "logintry_";
?>
<style>
  ul.config_form_list li label.<?php echo $prefix;?>lb{display:inline-block;width:120px; }
  .<?php echo $prefix;?>descr{color:#888;}
  .<?php echo $prefix;?>push{margin-left:120px;}
</style>
<form name="slsfrm" method="post" action="admin_do.php">
	<input type="hidden" name="bo_table" value="<?=$GLOBALS['bo_table']?>"/>
	<input type="hidden" name="gr_id" value="<?=$GLOBALS['gr_id']?>"/>
	<input type="hidden" name="id" value="<?=$plugin_id?>"/>
	<input type="hidden" name="act" value="logintry_save_setting"/>
	<input type="hidden" name="w" value="u"/>

	<ul class="config_form_list">
		<li>
      <label class="<?php echo $prefix;?>lb">로그인 시도 허용 횟수</label>
			<input type="text" id="logintry_times" name="plugin_config[logintry_times]" value="<?=htmlspecialchars($plugin_config['logintry_times'])?>"/>
      <span class="<?php echo $prefix;?>descr">허용횟수 이상 로그인 실패시 계정잠김</span>
		</li>
		<li>
      <label class="<?php echo $prefix;?>lb">계정 잠금 시간</label>
			<input type="text" id="logintry_locktime" name="plugin_config[login_retry_minute]" value="<?=htmlspecialchars($plugin_config['login_retry_minute'])?>"/>분
		</li>
    <li class="<?php echo $prefix;?>push">
			<input type="submit" class="gp_btn" value="설정 저장"/>
		</li>
	</ul>

</form>
