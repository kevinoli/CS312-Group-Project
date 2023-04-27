$(document).ready(function() {
    if($('html').css('filter')!="grayscale(1)"){
    $('#logo').click(function(){
        window.location = "./index";
    });

    // When dropdown value change check for dulication and restore if not
    // get previous value in fown down menu by lisiting for mousedown event
    var prevValue = "";
    $('select[name="colorSelect[]"]').mousedown(function() {
        prevValue = $(this).find(':selected').attr('id');
    });
    
    $('select[name="colorSelect[]"]').change( function() {
        // Check if it is already been chosen and warn then change back
        var newValue = $(this);
        var selected_colors = $('select[name="colorSelect[]"]').toArray();
        var dulplicate = false;
        // Check if color is already slected
        selected_colors.forEach(function(element) { if (newValue.find(':selected').attr('id')==element.value && newValue.attr('id')!=element.id){dulplicate = true;} });
        if (dulplicate == true){
            newValue.css('color', 'red');
            setTimeout(() => {
                newValue.css('color', 'black');
                newValue.find(':selected').attr('id', prevValue);
            }, 500);
        } else {
            // Change color of previous cells
            if (prevValue==selectedColor){
                selectedColor = newValue.find(':selected').attr('id');
            }
            $('td').filter(function() {
                if ($(this).css('background-color') == colorNameToRgb(prevValue)) {
                    $(this).css('background-color', colorNameToRgb(newValue.find(':selected').attr('id')));
                };
            })
            $(this).closest('tr').find('.select_col').css('background-color', colorNameToRgb(newValue.find(':selected').attr('id')));
        }
    });
    
    // Detect if radio button is changed and set change to selected color--------
    var selectedColor = $('.selected').css('background-color');
    $('.select_col').click(function() {
        selectedColor = $(this).closest('tr').find('select').find(':selected').attr('id');
        $('.selected').removeClass('selected');
        $(this).addClass('selected');
    });

    // Detect when cell in main table is click and change color to selected color-------
    $('.draw-table td').click(function() {
        selectedColor = $('.selected').css('background-color');
        var row = $(this).parent().index() + 1;
        var col = $(this).index() + 1;
        if($(this).attr('id')!="title"){
            $(this).css('background-color', selectedColor);
        }
    });
    

    // Detect when cell in main table is click and add cordinate to top table-------
    var color_count = $('.color-table tbody tr').length-1;
    let cordinates = Array.from(Array(color_count), () => new Set());
    $('.draw-table td').click(function() {
        // everytime a cell is colored add it to an array for its selected color
        if($(this).attr('id')!="title"){
            var selected_choice = $('.selected input').attr('value');
            var choice_num = parseInt(selected_choice, 10);
            var cord = $(this).attr('id');
            
            // Check if cordinate was already in different choice cell and remove it
            for(let i=0; i<cordinates.length; i++){
                for(let element of cordinates[i]){
                    if (element==cord){
                        cordinates[i].delete(element);
                    }
                }
            }
            
            // Add clicked cordnate to selected color choice
            cordinates[choice_num].add(cord);

            // Change label to reflect changes
            var newLabel = "";
            $(".select_col").each(function(i) {
                cordinates[i] = sortSet(cordinates[i]);
                for(let element of cordinates[i]){
                    newLabel = newLabel+element+" ";
                }
                $(this).closest('tr').find("td.cords input").val(newLabel);
                $(this).closest('tr').find('td.cords label').text(newLabel);
                newLabel = "";
            });
        };
    });
    }
});

function colorNameToRgb(colorName) {
    // create an invisible dummy element
    var dummy = $('<div>').css('color', colorName).hide().appendTo('body');
    // get the color in RGB format
    var colorRgb = dummy.css('color');
    // remove the dummy element
    dummy.remove();
    // return the RGB color as a string
    return colorRgb;
}

function sortSet(set) {
    const sortedArray = [...set]
    sortedArray.sort();
    return new Set(sortedArray);
}
  