<?php

$curl = curl_init();

curl_setopt_array($curl, array(
		CURLOPT_URL => 'https://www.facebook.com/momosalah/posts/415352513283045',
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => '',
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 0,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => 'GET',
		CURLOPT_HTTPHEADER => array(
				'authority: www.facebook.com',
				'cache-control: max-age=0',
				'sec-ch-ua: "Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
				'sec-ch-ua-mobile: ?0',
				'sec-ch-ua-platform: "macOS"',
				'upgrade-insecure-requests: 1',
				'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36',
				'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'sec-fetch-site: same-origin',
				'sec-fetch-mode: navigate',
				'sec-fetch-user: ?1',
				'sec-fetch-dest: document',
				'accept-language: en-US,en;q=0.9,ar;q=0.8',
				'cookie: sb=ym4FYUMSDgQ3Oo80zFFp0HUB; datr=ym4FYSOt_KWg2kaXP_PRmLuu; c_user=588305104; _fbp=fb.1.1628439855159.686357544; spin=r.1004354731_b.trunk_t.1630954703_s.1_v.2_; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1630998968565%2C%22v%22%3A1%7D; xs=31%3ADeFLESQzO2qLlQ%3A2%3A1630777636%3A-1%3A2197; fr=1CDXsjXIdoCGAMFCx.AWWzkZopj_OBL5zkVEGcVBduIgY.BhN0Fp.MP.AAA.0.0.BhN0Fp.AWUORuP5nDA; datr=3lCQX_zPOMwBDCwSW7YgnLpL'
		),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

exit;

//curl ini
$ch = curl_init();
curl_setopt($ch, CURLOPT_HEADER,0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT,60);
curl_setopt($ch, CURLOPT_REFERER, 'http://www.bing.com/');
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.8) Gecko/2009032609 Firefox/3.0.8');
curl_setopt($ch, CURLOPT_MAXREDIRS, 5); // Good leeway for redirections.
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // Many login forms redirect at least once.
curl_setopt($ch, CURLOPT_COOKIEJAR , "cookie.txt");

//curl post run-sync
 $curlurl="https://api.apify.com/v2/acts/apify~web-scraper/run-sync-get-dataset-items?token=B7nfMAJRXPDe9MBmzeDARyezL";
$curlpost="parameters"; // q=urlencode(data)
curl_setopt($ch, CURLOPT_URL, $curlurl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('test.json')); 
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json") );
$x='error';
$exec=curl_exec($ch);
$x=curl_error($ch);

$json = json_decode($exec);

print_r($json);

echo $x;

 
?>