$('document').ready(function () {
    const carousel = new bootstrap.Carousel('#myCarousel', {
        interval: 10000
    })
    $("#tagsIndex").autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.ajax({
                url: "http://192.168.160.58/Olympics/api/Utils/Search?q=" + request.term,
                dataType: "json"
            }).done(function (APIdata) {
                data = APIdata;
                let todos = data.map(function (todo) {
                    return {
                        value1: todo.TableName,
                        label: todo.Name,
                        value: todo.Id
                    }
                });
                response(todos.slice(0, 10));
            });
        },
        select: function (event, ui) {
            if (ui.item.value1 === 'Athletes') {
                window.location.href = "athleteDetails.html?id=" + ui.item.value;
            }
            else if (ui.item.value1 === 'Countries') { 
                window.location.href = "countryDetails.html?id=" + ui.item.value;
            }
            else if (ui.item.value1 === 'Competitions') {
                window.location.href = "competitionDetails.html?id=" + ui.item.value;
            }
            else if (ui.item.value1 === 'Modalities') {
                window.location.href = "modalityDetails.html?id=" + ui.item.value;
            }
            else if (ui.item.value1 === 'Games') {
                window.location.href = "gameDetails.html?id=" + ui.item.value;
            }
        },
    }).find("li").css({ width: "150px" });
    $("#tagsIndex").val(undefined);
});

    