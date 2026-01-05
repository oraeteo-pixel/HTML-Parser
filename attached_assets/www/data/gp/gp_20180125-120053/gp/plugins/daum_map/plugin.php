<?php
/**
 * 다음지도 플러그인 
 *
 * @package net.lovelyus.g5.plugin.daum_map
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 */
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 

$luDaum_map = new LUDaum_map();
$luDaum_map->hook($gp_scope);

/**
 * 
 * @author Chongmyung Park <byfun@byfun.com> 
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 */
class LUDaum_map {

    var $id;
    var $scope;
    var $plugin_url;
    var $plugin_path;
    var $plugin_config;
    var $config_file = 'cfg.plugin.daum_map.php';
    var $do_url;

    /**
     * hook : gpf 후킹
     * 
     * @access public
     * @return void
     */
    function hook($gp_scope) {
        $this->scope = $gp_scope;
        $this->id = gp_plugin_id(__FILE__);
        $this->plugin_path = dirname(__FILE__);
        $this->plugin_url = gp_plugin_url(__FILE__);
        $this->plugin_config = gp_read_config($this->config_file, array('dm_lat' => '37.86769870399902', 'dm_lng' => '127.73884573306562'), $this->scope);
        $this->do_url = GP_URL . '/do.php?scope=' . $this->scope . '&bo_table=' . $bo_table . '&wr_id=' . $wr_id . '&id=' . $this->id . '&act=';

        gp_add_action('pre_write', array($this, 'on_write'));
        gp_add_filter('sl_write_items', array($this, 'write_items'));
        gp_add_action('post_write_update', array($this, 'on_write_update'));
        gp_add_action('pre_view', array($this, 'on_view'));
        gp_add_action('pre_list', array($this, 'on_list'));
        gp_add_filter('gp_board_thumb', array($this, 'on_thumb'), 10, 7);

        gp_add_action('post_delete.tail', array($this, 'on_delete'));
        gp_add_action('post_delete_all.tail', array($this, 'on_delete'));

        gp_add_filter('gpa_settings', array($this, 'plugin_setting'), 10);
        gp_add_action('pxa_dm_save_setting', array($this, 'plugin_save_setting'));
        gp_add_filter('gpa_menu_plugin_' . $this->id, array($this, 'plugin_menu'));
        gp_add_action('pxa_dm_install', array($this, 'plugin_install'));
        gp_add_action('pxa_dm_uninstall', array($this, 'plugin_uninstall'));
    }

    function on_write() {
        global $bo_table, $wr_id;
        $ex = $this->_get_maps($bo_table, $wr_id);
        if (empty($ex)) {
            $GLOBALS['dm_lat'] = $this->plugin_config['dm_lat'];
            $GLOBALS['dm_lng'] = $this->plugin_config['dm_lng'];
            $GLOBALS['dm_use_map'] = false;
        } else {
            $GLOBALS['dm_lat'] = $ex[0]['pos_lat'];
            $GLOBALS['dm_lng'] = $ex[0]['pos_lng'];
            $GLOBALS['dm_use_map'] = true;
        }
    }

    function write_items($items) {
        array_push($items, array('head' => '지도', 'td_render' => array($this, 'write_form'), 'content_render' => array($this, 'write_form'), 'order' => 85));
        return $items;
    }

    function write_form() {
        global $bo_table, $wr_id, $dm_lat, $dm_lng, $dm_use_map;
        if (!$this->plugin_config['maps_apikey'] || !$this->plugin_config['local_apikey']) {
            echo '<div style="margin:5px;padding:10px;border:1px solid red;background-color:#fffbfe;color:red;">API 키를 설정하신 후 사용하세요. <a href="' . gp_url(GP_ADMIN_URL . '/setting.php', $this->scope, false, $this->id) . '">[설정하기]</a></div>';
            return;
        }
        include_once $this->plugin_path . '/tpl/write.form.php';
    }

    function _get_maps($bo_table = '', $wr_ids = '') {
        $where_in = ' wr_id in (' . (is_array($wr_ids) ? implode(',', $wr_ids) : $wr_ids) . " )";
        if (empty($wr_ids))
            return array();
        $res = sql_query("SELECT * FROM gpf_daum_map WHERE bo_table = '$bo_table' AND $where_in");
        $list = array();
        while ($row = sql_fetch_array($res)) {
            array_push($list, $row);
        }
        return $list;
    }

    function on_write_update() {
        global $dm_lat, $dm_lng, $dm_use_map, $bo_table, $wr_id, $member;

        if ($dm_use_map != 1) {
            sql_query("DELETE FROM gpf_daum_map WHERE bo_table='{$bo_table}' AND wr_id='{$wr_id}'");
            return;
        }

        $ex = $this->_get_maps($bo_table, $wr_id);
        if (empty($ex)) {
            sql_query("INSERT INTO gpf_daum_map SET bo_table = '{$bo_table}', wr_id = '{$wr_id}', mb_id = '{$member['mb_id']}', pos_lat = '{$dm_lat}', pos_lng = '{$dm_lng}', reg_date='" . G5_TIME_YMDHIS . "'");
        } else {
            sql_query("UPDATE gpf_daum_map SET pos_lat = '{$dm_lat}', pos_lng = '{$dm_lng}' WHERE bo_table = '{$bo_table}' AND wr_id = '{$wr_id}' ");
        }
    }

    function on_view() {
        global $view, $bo_table, $wr_id;
        if (!$this->plugin_config['maps_apikey'])
            return;
        $map = sql_fetch("SELECT * FROM gpf_daum_map WHERE bo_table = '{$bo_table}' AND wr_id = '{$wr_id}'");
        unset($map['bo_table']);
        unset($map['wr_id']);
        if (!empty($map)) {
            $GLOBALS['view']['daum_maps'] = $map;
            $add = '<div id="daum_map" style="margin:0 auto 10px auto;padding:5px;width:95%;height:400px;border:1px solid #f0f0f0;"></div>';
            $GLOBALS['view']['content'] = $add . $GLOBALS['view']['content'];
            $view['content_head'] = $add;
            ?>
            <script type="text/javascript" src="http://apis.daum.net/maps/maps3.js?apikey=<?php echo $this->plugin_config['maps_apikey']; ?>"></script>
            <script type="text/javascript">
                var map;
                $(document).ready(function() {
                    map = new daum.maps.Map(document.getElementById('daum_map'), {
                        center: new daum.maps.LatLng(<?php echo $map['pos_lat']; ?>, <?php echo $map['pos_lng']; ?>),
                        level: 3
                    });
                    var zoomControl = new daum.maps.ZoomControl();
                    map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
                    var mapTypeControl = new daum.maps.MapTypeControl();
                    map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
                    var marker = new daum.maps.Marker({
                        position: map.getCenter()
                    });
                    marker.setMap(map);
                });
            </script>
            <?php
        } // not empty
    }

    function on_list() {
        global $list, $bo_table;

        if (empty($list))
            return;

        $where_in = ' wr_id in (';
        $wr_indexer = array();

        for ($i = 0, $to = count($list); $i < $to; $i++) {
            $where_in .= " {$list[$i]['wr_id']}, ";
            $wr_indexer[$list[$i]['wr_id']] = $i;
        }
        $where_in .= " -1)";

        $res = sql_query("SELECT * FROM gpf_daum_map WHERE bo_table = '$bo_table' AND $where_in");
        while ($row = sql_fetch_array($res)) {
            $idx = $wr_indexer[$row['wr_id']];
            $list[$idx]['daum_map'] = $row;
        }
        $GLOBALS['list'] = $list;
        ?>
        <script type="text/javascript" src="http://apis.daum.net/maps/maps3.js?apikey=<?php echo $this->plugin_config['maps_apikey']; ?>"></script>
        <script type="text/javascript">
            $(document).ready(function() {
                $('img').filter(function(idx) {
                    return $(this).attr('src').match(/^map:/);
                }).each(function(idx) {
                    $idiv = $('<div></div>').addClass('daum_map');
                    $(this).before($idiv).hide();
                    $idiv.width($(this).width());
                    $idiv.height($(this).height());

                    var info = $(this).attr('src').split(":");
                    var pos = new daum.maps.LatLng(parseFloat(info[1]), parseFloat(info[2]));
                    var map = new daum.maps.StaticMap($idiv.get(0), {
                        center: pos,
                        level: 3,
                        marker: [{}]
                    });
                });

            });
        </script>
        <?php
    }

    function on_thumb($thumb, $bo_table, $wr_id, $wr_content, $wr_files, $thumb_width, $thumb_height) {
        global $list;

        if ($thumb)
            return $thumb;
        if (!isset($list))
            return $thumb;

        foreach ($list as $row) {
            if ($row['wr_id'] == $wr_id) {
                if (!empty($row['daum_map']))
                    return 'map:' . $row['daum_map']['pos_lat'] . ':' . $row['daum_map']['pos_lng'];
                break;
            }
        }
        return $thumb;
    }

    function on_delete() {
        global $bo_table, $wr_id, $tmp_array;
        $wr_ids = array();
        if ($wr_id)
            array_push($wr_ids, $wr_id);
        if ($tmp_array)
            $wr_ids = $tmp_array;

        $where_in = ' wr_id in (';
        $wr_indexer = array();

        for ($i = 0, $to = count($wr_ids); $i < $to; $i++) {
            $where_in .= " {$wr_ids[$i]}, ";
        }
        $where_in .= " -1)";

        sql_query("DELETE FROM gpf_daum_map WHERE bo_table = '$bo_table' AND $where_in ");
    }

    /**
     * 설정페이지에 항목 추가
     * 
     * @param mixed $gpa_settings 
     * @access public
     * @return void
     */
    function plugin_setting($gpa_settings) {
        array_push($gpa_settings, array('ID' => $this->id, 'title' => '다음지도', 'print_contents' => array($this, 'plugin_config_contents'), 'order' => 10));
        return $gpa_settings;
    }

    /**
     * 플러그인 설정 페이지
     * 
     * @access public
     * @return void
     */
    function plugin_config_contents() {
        $plugin_config = $this->plugin_config;
        $plugin_id = $this->id;
        $plugin_path = $this->plugin_path;
        $plugin_url = $this->plugin_url;
        include_once $this->plugin_path . "/tpl/config.form.php";
    }

    /**
     * 설정 저장
     * 
     * @access public
     * @return void
     */
    function plugin_save_setting() {
        gp_write_config($this->config_file, gp_strip_slashes($_REQUEST['plugin_config']), $this->scope);
        alert('다음지도 플러그인 설정 저장 완료');
    }

    /**
     * plugins 페이지에 메뉴 추가
     * 
     * @param mixed $menus 
     * @access public
     * @return void
     */
    function plugin_menu($menus) {
        global $bo_table;

        if (gp_table_exists('gpf_daum_map')) {
            if (gp_is_activated($this->id, $this->scope)) {
                array_push($menus, array('href' => gp_url('setting.php', $this->scope, $noqm = false, $this->id), 'text' => '설정'));
            }
            array_push($menus, array('href' => gp_url('admin_do.php', $this->scope) . '&id=' . $this->id . '&act=dm_uninstall', 'attr' => 'onclick="return confirm(\'등록된 모든 DB 정보가 삭제됩니다.\\n진행하시겠습니까?\');"', 'text' => 'DB삭제'));
        } else {
            array_push($menus, array('href' => gp_url('admin_do.php', $this->scope) . '&id=' . $this->id . '&act=dm_install', 'text' => 'DB생성', 'attr' => ''));
        }
        return $menus;
    }

    /**
     * 플러그인 설치
     * 
     * @access public
     * @return void
     */
    function plugin_install() {
      global $id;
      if($this->id != $id) return;
      $install_script = <<<EOF
        CREATE TABLE IF NOT EXISTS `gpf_daum_map` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `bo_table` varchar(20) NOT NULL,
          `wr_id` int(11) NOT NULL,
          `mb_id` varchar(255) NOT NULL,
          `pos_lat` varchar(255) NOT NULL,
          `pos_lng` varchar(255) NOT NULL,
          `reg_date` datetime NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8;
EOF;
      $f = explode(";", $install_script);
      for ($i = 0; $i < count($f); $i++) {
          if (trim($f[$i]) == "")
              continue;
          sql_query($f[$i]);
      }
      goto_url(gp_url('plugins.php', $this->scope));
    }

    /**
     * 플러그인 제거
     * 
     * @access public
     * @return void
     */
    function plugin_uninstall() {
      global $id;
      if($this->id != $id) return;
      sql_query("DROP TABLE gpf_daum_map", false);
      gp_deactivate_plugin($this->id, $this->scope);
      goto_url(gp_url('plugins.php', $this->scope));
    }

}
?>
