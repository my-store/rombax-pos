/* ===================================================================== ###
......................................
......................................
......................................
   <=( Calendar Helper )=>
......................................
......................................
......................................
*/

const date    = new Date()
let tahun   = date.getFullYear()
let bulan   = date.getMonth()
let tanggal = date.getDate()
let hari    = date.getDay()
let jam     = date.getHours()
let menit   = date.getMinutes()
let detik   = date.getSeconds()

module.exports = (getParams, callback, getUrutan = null) =>
{
    switch(hari) 
    {
        case 0 :
            hari = "Minggu"
        break
            
        case 1 :
            hari = "Senin"
        break

        case 2 :
            hari = "Selasa"
        break

        case 3 :
            hari = "Rabu"
        break

        case 4 :
            hari = "Kamis"
        break

        case 5 :
            hari = "Jumat"
        break

        case 6 :
            hari = "Sabtu"
        break
    }
    switch(bulan) 
    {
        case 0 : 
            bulan = "Januari" 
        break

        case 1: 
            bulan = "Februari" 
        break

        case 2 : 
            bulan = "Maret" 
        break

        case 3 : 
            bulan = "April" 
        break

        case 4 : 
            bulan = "Mei" 
        break

        case 5 : 
            bulan = "Juni" 
        break

        case 6 : 
            bulan = "Juli" 
        break

        case 7 : 
            bulan = "Agustus" 
        break

        case 8 : 
            bulan = "September" 
        break

        case 9 : 
            bulan = "Oktober" 
        break

        case 10 : 
            bulan = "November" 
        break

        case 11 : 
            bulan = "Desember" 
        break
    }

    var data    = getParams == "Detik" ? detik
                : 
                getParams == "Menit" ? menit 
                : 
                getParams == "Jam" ? jam 
                : 
                getParams == "Hari" ? hari 
                : 
                getParams == "Tanggal" ? tanggal 
                : 
                getParams == "Bulan" ? bulan 
                : 
                getParams == "Tahun" ? tahun 
                : 
                null

    var urutan  = getParams == "Bulan" ? 
            bulan == "Januari" ? 1
                :
                bulan == "Februari" ? 2
                :
                bulan == "Maret" ? 3
                :
                bulan == "April" ? 4
                :
                bulan == "Mei" ? 5
                :
                bulan == "Juni" ? 6
                :
                bulan == "Juli" ? 7
                :
                bulan == "Agustus" ? 8
                :
                bulan == "September" ? 9
                :
                bulan == "Oktober" ? 10
                :
                bulan == "November" ? 11
                :
                bulan == "Desember" ? 12
                : null
            : 
            getParams == "Hari" ?
                hari == "Minggu" ? 1
                :
                hari == "Senin" ? 2
                :
                hari == "Selasa" ? 3
                :
                hari == "Rabu" ? 4
                :
                hari == "Kamis" ? 5
                :
                hari == "Jumat" ? 6
                :
                hari == "Sabtu" ? 7
                : null
            : null
    callback(getUrutan == null ? data : urutan)
}