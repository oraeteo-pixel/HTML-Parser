<?php
/**
 * Fancy URL 라우팅 모듈
 *
 * @package GPF
 * @author Chongmyung Park <byfun@byfun.com>
 * @copyright Chongmyung Park
 * @license GPLv2 License http://www.gnu.org/licenses/gpl-2.0.html
 * @link http://lovelyus.net
 * @since 5.1.0
 */
include_once "_common.php";

if(1    ) {

    gp_add_filter('app_routes', _add_url);

    function _add_url($data) {
        array_push($data,
                    array('uri' => '/test/t2/(?<word>\w+)/(?<last_word>\w+)',
                          'controller'=>_control,
                        'vars'=>['last_word', 'word']));
        array_push($data,
            array('uri' => '/tt/(\w+)/(\w+)/t3',
                'controller'=>_control,
                'vars'=>['v1', 'v2']));
        array_push($data,
            array('uri'=>'/user/test',
                'controller'=>_control));
        return $data;
    }

    function _control() {
        print_r2(func_get_args());
    }
}


$routes = array();
$routes = gp_do_filter('app_routes', $routes);
$uri = '/'.$_REQUEST['_gp_route_uri'];

foreach($routes as $r) {
    if (preg_match("#^{$r['uri']}$#Ui", $uri, $args)) {
        $requested = $_REQUEST;
        unset($args[0]);
        unset($requested['_gp_route_uri']);
        $params = array();
        if (isset($r['vars']) && $r['vars']) {
            foreach ($r['vars'] as $idx => $vname) {
                $params[$vname] = $args[$vname];
            }
        } else {
            $params = $args;
        }
        $params = array_merge($params, array('requested'=>$requested));
        call_user_func_array($r['controller'], $params);

        exit();
    }
}

alert('등록된 프로그램이 없습니다.');
