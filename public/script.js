const getTableDataUrl = "/result";
const startCrawlingUrl = "/status/";

function ajax(url, updateTable, updatePagination) {
  axios.get(url).then(function(res) {
        document.getElementById('totalCount').innerHTML = res.data.count;
        updateTable(res.data.data);
        updatePagination(res.data.pages);
    })
    .catch(function(err) {
        console.log(err);
    });
}

function updatePagination(noOfPages) {
  paginationHTML = "";
  for (let i = 1; i <= noOfPages; i++) {
    paginationHTML += '<span class="page" onclick="getTableDetails(' + i + ');">' + i + '</span>';
  }
  document.getElementById("pagination").innerHTML = paginationHTML;
}

function updateTable(data) {
  tableHTML = "";
  data.forEach(row => {
    tableHTML += "<tr>";
    tableHTML += "<td>" + row["url"] + "</td>";
    tableHTML += "<td>" + row["params"] + "</td>";
    tableHTML += "<td>" + row["count"] + "</td>";
    tableHTML += "<td>" + new Date(+row['timeStamp']).toLocaleString() + "</td>";
    tableHTML += "</tr>";
  });

  document.getElementById("table-body").innerHTML = tableHTML;
}

function getTableDetails(pageNo){
    let url = getTableDataUrl + '/' + pageNo;
    ajax(url, updateTable, updatePagination);
}

function switchOperation(operation){
    url = startCrawlingUrl + operation;
    axios.get(url).then(function (res) {
        document.getElementById('status').innerHTML = res.data;
    })
    .catch(function (err) {
        console.log(err);
    });
}