<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 
?>
<style>
	ul.config_form_list li label.fkr_lb{display:inline-block;width:80px; }
	.descr{color:#888;}
	.push{margin-left:80px;}
</style>
<form name="slsfrm" method="post" action="admin_do.php">
	<input type="hidden" name="bo_table" value="<?=$GLOBALS['bo_table']?>"/>
	<input type="hidden" name="gr_id" value="<?=$GLOBALS['gr_id']?>"/>
	<input type="hidden" name="id" value="<?=$plugin_id?>"/>
	<input type="hidden" name="act" value="flickr_save_setting"/>
	<input type="hidden" name="w" value="u"/>

	<ul class="config_form_list">
		<li>
			<label class="fkr_lb">API Key</label>
			<input type="text" size="40" id="fkr_apikey" name="plugin_config[apikey]" value="<?=htmlspecialchars($plugin_config['apikey'])?>"/>
      <span class="descr">플리커 앱 API 키 (<a href="http://www.flickr.com/services/apps/create/" target="_blank">발급받기</a>)</span>
		</li>
		<li>
			<label class="fkr_lb">목록수</label>
			<input type="text" size="5" id="fkr_search_rows" name="plugin_config[search_rows]" value="<?=htmlspecialchars($plugin_config['search_rows'])?>"/>
      <span class="descr">검색시 페이지당 목록 수</span>
		</li>
		<li>
			<label class="fkr_lb">저작권</label>
			<span class="descr"><a href="http://creativecommons.org/licenses/" target="_blank">CC 저작권 알아보기</a></span> 
      <div style="padding-left:85px">
      <?php 
      $licenses = explode(',', $plugin_config['license']);
      $license_opts = array( 
        array('id'=>0, 'text'=>'저작권 선택 안함 (이 옵션을 선택시 다른 저작권 선택을 무시합니다)'),
        array('id'=>4, 'text'=>'저작자표시 (BY)'),
        array('id'=>6, 'text'=>'저작자표시-변경금지 (BY-ND)'),
        array('id'=>3, 'text'=>'저작자표시-비영리-변경금지 (BY-NC-ND)'),
        array('id'=>2, 'text'=>'저작자표시-비영리 (BY-NC)'),
        array('id'=>1, 'text'=>'저작자표시-비영리-동일조건변경허락 (BY-NC-SA)'),
        array('id'=>5, 'text'=>'저작자표시-동일조건변경허락 (BY-SA)')
      );
      foreach($license_opts as $lic)
      {
        echo '<input type="checkbox" name="plugin_config[license][]" id="fkr_license_'.$lic['id'].'" value="'.$lic['id'].'" '.(in_array($lic['id'], $licenses) ? 'checked' : '').'/>';
        echo '<label for="fkr_license_'.$lic['id'].'">'.$lic['text'].'</label>';
        echo '<br/>';
      }
      ?>
      </div>
		</li>
		<li class="push">
			<input type="submit" class="gp_btn" value="설정 저장"/>
		</li>
	</ul>

</form>
