<?
if (!defined("_GNUBOARD_"))
    exit; // 개별 페이지 접근 불가 
if (!$dm_lat || !$dm_lng) {
    $dm_lat = 37.86769870399902;
    $dm_lng = 127.73884573306562;
}
?>

<div id="dm_option">
    <input type="checkbox" name="dm_use_map" id="dm_use_map" value="1" <?php if ($dm_use_map) echo 'checked'; ?>/>
    <label for="dm_use_map">지도를 첨부합니다.</label>
</div>
<div id="dm_map_panel">
    <div id="daum_map" style="width:100%;height:400px"></div>
    <div id="dm_search">
        <label>주소검색 : </label>
        <input type="text" name="dm_stx" id="dm_stx" size="20"/>
        <input type="button" id="dm_btn_search" value="검색"/>
        <div id="dm_search_results"></div>
    </div>
</div>
<input type="hidden" name="dm_lat" id="dm_lat" value="<?php echo htmlspecialchars($dm_lat); ?>"/>
<input type="hidden" name="dm_lng" id="dm_lng" value="<?php echo htmlspecialchars($dm_lng); ?>"/>

<script type="text/javascript" src="http://apis.daum.net/maps/maps3.js?apikey=<?php echo $this->plugin_config['maps_apikey']; ?>"></script>
<style>
    #daum_map{}
    #dm_option{}
    #dm_search{margin-top:10px;padding:5px;border:1px solid #f0f0f0;}
    #dm_map_panel{}
    #dm_search_results ol{margin:5px;padding:5px 5px 5px 30px;border:1px solid #f0f0f0;}
    .dm_search_btns{overflow:auto;}
    .dm_left{float:left;}
    .dm_right{float:right;}
    a.dm_btn{display:inline-block;padding:3px 8px;border:1px solid #ccc;background-color:#fcfcfc;color:#333;text-decoration:none;}
    a.dm_btn:hover{background-color:#f0f0f0;}
</style>
<script type="text/javascript">
    var map;
    var dm = {};
    dm.page = 1;
    dm.l = 'http://apis.daum.net/local/geo/addr2coord?apikey=<?php echo $this->plugin_config['local_apikey']; ?>&output=json&q=';
    dm.use_map = $('#dm_use_map');
    dm.option_panel = $('#dm_option');
    dm.map_panel = $('#dm_map_panel');
    dm.btn_search = $('#dm_btn_search');
    dm.stx = $('#dm_stx');
    dm.res = $('#dm_search_results');
    dm.lat = $('#dm_lat');
    dm.lng = $('#dm_lng');
    dm.set_position = function(lat, lng) {
        map.setCenter(new daum.maps.LatLng(lat, lng));
    };
    dm.set_position_value = function(latlng) {
        dm.lat.val(latlng.getLat());
        dm.lng.val(latlng.getLng());
    };
    dm.html = function(str) {
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&gt;/g, ">");
        return str;
    };
    dm.search_close = function() {
        dm.res.html('');
        dm.page = 1;
    };
    dm.search_done = function(json) {
        var ch = json.channel;
        if (ch.totalCount == 0) {
            alert('검색 결과가 없습니다.');
            return;
        }
        var total_page = Math.ceil(ch.totalCount / ch.result);
        var res = [];
        var btns = [];
        btns.push('<div class="dm_search_btns">');
        btns.push('<div class="dm_left">');
        if (dm.page > 1)
            btns.push('<a href="javascript:dm.search_prev();" class="dm_btn">이전</a>&nbsp;');
        if (dm.page < total_page)
            btns.push('<a href="javascript:dm.search_next();" class="dm_btn">다음</a>');
        btns.push('</div>');
        btns.push('<div class="dm_right"><a href="javascript:dm.search_close();" class="dm_btn">닫기</a></div>');
        btns.push('</div>');
        res.push(btns.join(''));
        res.push('<ol>');
        $.each(ch.item, function(k, v) {
            res.push('<li><a href="javascript:dm.set_position(\'' + v.lat + '\', \'' + v.lng + '\');">' + dm.html(v.title) + '</a></li>');
        });
        res.push('</ol>');
        res.push(btns.join(''));
        dm.res.html(res.join(''));
    };
    dm.search = function() {
        var stx = dm.stx.val();
        $.ajax({
            url: dm.l + encodeURI(stx) + '&pageno=' + dm.page,
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function(json) {
                dm.search_done(json);
            }
        });
    };
    dm.search_next = function() {
        dm.page++;
        dm.search();
    }
    dm.search_prev = function() {
        dm.page--;
        dm.search();
    }
    dm.btn_search.click(function(evt) {
        dm.search();
    });
    dm.stx.keypress(function(evt) {
        var keycode = (evt.keyCode ? evt.keyCode : evt.which);
        if (keycode == '13') {
            evt.preventDefault();
            dm.search();
        }
    });

    $(document).ready(function() {
        map = new daum.maps.Map(document.getElementById('daum_map'), {
            center: new daum.maps.LatLng(<?php echo $dm_lat; ?>, <?php echo $dm_lng; ?>),
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

        daum.maps.event.addListener(map, 'center_changed', function() {
            marker.setPosition(map.getCenter());
            dm.set_position_value(map.getCenter());
        });

        if (!dm.use_map.is(':checked'))
        {
            dm.map_panel.hide();
        }

        dm.use_map.click(function(evt) {
            if ($(this).is(':checked')) {
                dm.map_panel.show();
            } else {
                dm.map_panel.hide();
            }
        });
    });
</script>
