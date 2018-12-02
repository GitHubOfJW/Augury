module.exports = class StringUtil {
  
  static xssFilter(str){
    if(!str) return "";
    return str.replace('<script>','&lt;script&gt;').replace('</script>','&lt/script&gt;');
  }
}