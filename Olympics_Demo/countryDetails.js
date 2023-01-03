// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Countries/' )
    self.displayName = 'Country Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.IOC = ko.observable('');
    self.Flag = ko.observable('');
    self.Events = ko.observableArray([]);
    self.Participant = ko.observableArray([]);
    self.Organizer = ko.observableArray([]);
    self.Url = ko.observable('');
    self.GameId = ko.observable('');
    self.GameName = ko.observable('');
    self.Medals = ko.observableArray([]);



    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCountry...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.IOC(data.IOC);
            self.Flag(data.Flag);
            self.Events(data.Events);
            self.Participant(data.Participant);
            self.Organizer(data.Organizer);
            if (data.Flag == null) {
                $("#Flag").hide();
            }
            if (data.Events == null) {
                $("#AccordianEvents").hide();
                $("#Eve").hide();
            }
            if (data.Participant == null) {
                $("#AccordianParticipant").hide();
                $("#Par").hide();
            }
            if (data.Organizer == null) {
                $("#AccordianOrganizer").hide();
                $("#Org").hide();
            }
        //     let kakaka = 'http://192.168.160.58/Olympics/api/Statistics/Medals_Games?id=' + self.Id()
        //     ajaxHelper(kakaka, 'GET').done(function (data) {
        //         self.GameId(data.GameId);
        //         self.GameName(data.GameName);
        //         self.Medals(data.Medals);
        //         var lista = [];
        //         for (var i = 0; i < Object.keys(data.kakaka).length; i++) 
        //         {lista.append(data.Medals[i].Medals[2].Counter) }
        //         console.log(lista)
        //         var nome = [];
        //         for (var i = 0; i < data.Medals.length; i++)
        //         { nome.append(data.Medals[i].GameName) }
        //         console.log(nome)
        //         var ctx = document.getElementById("bronze");
        //         var myChart = new Chart(ctx, {
        //         type: 'bar',
        //         data: {
        //         labels: nome,
        //         datasets: [{
        //             data: lista,
        //             label: 'Medalhas de Bronze por Edição dos Jogos Olímpicos',
        //             backgroundColor: ['rgba(250, 138, 52, 0.4)','rgba(52, 230, 250, 0.4)',],
        //             borderColor: ['rgba(250, 131, 40, 0.6)','rgba(54, 162, 235, 0.6)',],
        //             borderWidth: 1
        //         }]
        //     }
        //     }); 
        //  });
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
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})