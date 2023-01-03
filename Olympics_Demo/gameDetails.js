// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Games/FullDetails?id=');
    self.displayName = 'Olympic Games edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.CountryName = ko.observable('');
    self.City = ko.observable('');
    self.Logo = ko.observable('');
    self.Name = ko.observable('');
    self.Photo = ko.observable('');
    self.Season = ko.observable('');
    self.Year = ko.observableArray('');
    self.Url = ko.observable('');
    self.Lat = ko.observable('');
    self.Lon = ko.observable('');
    self.Athletes = ko.observableArray([]);
    self.Modalities = ko.observableArray([]);
    self.Competitions = ko.observableArray([]);
    self.Medals = ko.observableArray([]);

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getGame...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.CountryName(data.CountryName);
            self.Logo(data.Logo);
            self.Name(data.Name);
            self.Photo(data.Photo);
            self.Season(data.Season);
            self.Year(data.Year);
            self.City(data.City);
            self.Lat(data.Lat);
            self.Lon(data.Lon);
            self.Athletes(data.Athletes);
            self.Modalities(data.Modalities);
            self.Competitions(data.Competitions);
            self.Medals(data.Medals);  
            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
            labels: [data.Medals[0].MedalName, data.Medals[1].MedalName, data.Medals[2].MedalName],
            datasets: [{
            backgroundColor: [
                "#ffdf00",
                "#95a5a6",
                "#b08d57",
            ],
            data: [data.Medals[0].Counter, data.Medals[1].Counter, data.Medals[2].Counter]
            }]
        }
        });
        });
    };
    

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

  

    self.formatPosition = function(med) {
        if(med == "1")
          return '<span style="font-size: 17px"> &#129351; </span>';
        if(med == "2")
          return '<span style="font-size: 17px"> &#129352; </span>';
        if(med == "3")
          return '<span style="font-size: 17px"> &#129353; </span>';
        if(med == "4")
          return "";
    };
    self.formatMedal = function(med) {
        if(med == "1")
          return '<span style="font-size: 17px"> &#129351; </span>';
        if(med == "2")
          return '<span style="font-size: 17px"> &#129352; </span>';
        if(med == "3")
          return '<span style="font-size: 17px"> &#129353; </span>';
        if(med == "4")
          return "";
    };
    
    self.formatSex = function(sexo) {
        if(sexo == "M")
          return '<i style="font-size:17px" class="fa fa-mars" aria-hidden="true"></i>';
        if(sexo == "F")
          return '<i style="font-size:17px" class="fa fa-venus" aria-hidden="true"></i>';
    };
    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    


    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    
var Counter = [];
var CountryName = [];
$.ajax({
type: 'GET',
url: 'http://192.168.160.58/Olympics/api/statistics/Medals_Country?id=' + pg,
headers: {
'Content-Type': 'application/json'
},
success: function (data, status, xhr) {

var medData = data;

medData.forEach(element => {
Counter.push(element.Medals.reduce((accum, ele) => ele.Counter + accum, 0))
CountryName.push(element.CountryName);
});

createBarGraph(Counter, CountryName);

}
});

function createBarGraph(Counter, CountryName) {
let barChart = new Chart("graficosos", {
type: "bar",
data: {
labels: CountryName,
datasets: [{
data: Counter,
label: 'Number of Medals per country in this Olympic Games edition',
backgroundColor: ["rgba(255, 56, 56, 0.5)", "rgba(59, 255, 131, 0.8)"],
borderColor: ['rgba(255, 0, 0, 0.8)','rgba(15, 212, 87, 1)',],
borderWidth: 1  
}]
},
options:{ 
    indexAxis: 'y',
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true
      }
    },
   
}
});
}


    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})