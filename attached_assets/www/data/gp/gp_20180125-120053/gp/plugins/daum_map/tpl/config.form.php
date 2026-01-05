<?
if (!defined("_GNUBOARD_"))
    exit; // 개별 페이지 접근 불가 
$prefix = "dm_";
?>
<style>
    ul.config_form_list li label.<?php echo $prefix; ?>lb{display:inline-block;width:80px; }
    .<?php echo $prefix; ?>descr{color:#888;}
    .<?php echo $prefix; ?>push{margin-left:80px;}
</style>
<form name="slsfrm" method="post" action="admin_do.php">
    <input type="hidden" name="bo_table" value="<?= $GLOBALS['bo_table'] ?>"/>
    <input type="hidden" name="gr_id" value="<?= $GLOBALS['gr_id'] ?>"/>
    <input type="hidden" name="id" value="<?= $plugin_id ?>"/>
    <input type="hidden" name="act" value="dm_save_setting"/>
    <input type="hidden" name="w" value="u"/>

    <ul class="config_form_list">
        <li>
            <label class="<?php echo $prefix; ?>lb">지도 API Key</label>
            <input type="text" name="plugin_config[maps_apikey]" value="<?= htmlspecialchars($plugin_config['maps_apikey']) ?>" size="30"/>
            <span class="<?php echo $prefix; ?>descr">다음 지도 API 키 (<a href="http://dna.daum.net/myapi/mapsapi/new" target="_blank">발급받기</a>)</span>
        </li>
        <li>
            <label class="<?php echo $prefix; ?>lb">로컬 API Key</label>
            <input type="text" name="plugin_config[local_apikey]" value="<?= htmlspecialchars($plugin_config['local_apikey']) ?>" size="30"/>
            <span class="<?php echo $prefix; ?>descr">다음 로컬 API 키 (<a href="http://dna.daum.net/myapi/dataapi/new" target="_blank">발급받기</a>)</span>
        </li>
        <li>
            <label class="<?php echo $prefix; ?>lb">기본 위도</label>
            <input type="text" name="plugin_config[dm_lat]" value="<?= htmlspecialchars($plugin_config['dm_lat']) ?>" size="30"/>
            <span class="<?php echo $prefix; ?>descr">Latitude</span>
            </div>
        </li>
        <li>
            <label class="<?php echo $prefix; ?>lb">기본 경도</label>
            <input type="text" name="plugin_config[dm_lng]" value="<?= htmlspecialchars($plugin_config['dm_lng']) ?>" size="30"/>
            <span class="<?php echo $prefix; ?>descr">Longitude</span>
            </div>
        </li>
        <li class="<?php echo $prefix; ?>push">
            <input type="submit" class="gp_btn" value="설정 저장"/>
        </li>
    </ul>

</form>
