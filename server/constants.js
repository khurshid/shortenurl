
// appplication settings
exports.port = 3030;
exports.root_url = "http://localhost:"+this.port+"/";


exports.get_query = 
'SELECT u.*, (SELECT GROUP_CONCAT(DISTINCT s.country ORDER BY s.country ASC SEPARATOR ", ") FROM stats s WHERE s.url_id=u.id) as country FROM urls u ORDER BY u.id DESC';
exports.check_valid_url_query = 'SELECT * FROM urls WHERE segment = {SEGMENT} AND DATEDIFF(CURDATE(),DATE_ADD(datetime_added,interval 30 day))<1';
exports.checksegment_query = 'SELECT * FROM urls WHERE segment = {SEGMENT}';
exports.add_query = 'INSERT INTO urls SET url = {URL}, segment = {SEGMENT}, ip = {IP}';
exports.check_url_query = 'SELECT * FROM urls WHERE url = {URL}';
exports.update_views_query = 'UPDATE urls SET num_of_clicks = {VIEWS} WHERE id = {ID}';
exports.insert_view = 'INSERT INTO stats SET ip = {IP}, url_id = {URL_ID}, country = {COUNTRY}';
exports.COUNTRYAPI = 'https://extreme-ip-lookup.com/json/';

// database setting
exports.host = 'localhost';
exports.user = 'khurshid';
exports.password = 'Jan@1984';
exports.database = 'shortenurl';