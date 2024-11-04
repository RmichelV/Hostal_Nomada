<style>
    .reservations{
        display: flex;
        width:100%;
        flex-direction: column;
        align-items: center
    }
    .qr-img{
        width: 20%;
    }

</style>


    <h2>Reservación</h2>

    <h3>Realiza tu reservación aquí </h3>

    <form action="{{ route('reservations.store') }}" method="post" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label for="" class="form-label">Tipo de Habitación</label>
            <select name="room_type" id="room_type" class="form-control">
                <option value="">Seleccione una habitación</option>
                @foreach ($room_types as $room_type)
                    <option value="{{ $room_type->id }}" data-price="{{ $room_type->price }}" {{ old('room_type') == $room_type->id ? 'selected' : '' }}>
                        {{ $room_type->name }}
                    </option>
                @endforeach
            </select>
            <small id="helpId" class="form-text text-muted">Por favor seleccione una habitación de la lista</small>
        </div>
        
        <div class="mb-3">
            <label for="" class="form-label">Precio unitario</label>
            <input
                type="number"
                class="form-control @error('price') is-invalid @enderror"
                name="price"
                id="price"
                aria-describedby="helpId"
                placeholder="Escriba Aquí por favor"
                value="{{ old('price') }}"
                readonly
            />
        </div>

        <div class="mb-3">
            <label for="" class="form-label">Cantidad de habitaciones </label>
            <input
                type="number"
                class="form-control @error('number_of_rooms') is-invalid @enderror"
                name="number_of_rooms"
                id=""
                aria-describedby="helpId"
                placeholder="Escriba Aquí por favor"
                value="{{old('number_of_rooms')}}"
            />
            <small id="helpId" class="form-text text-muted">Por favor introduzca valores enteros</small>
            @error('number_of_rooms')
                <div class="invalid-feedback">
                    {{ $message }}
                </div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="number_of_people" class="form-label">Cantidad de personas</label>
                <select name="number_of_people" id="number_of_people" class="form-control @error('number_of_people') is-invalid @enderror">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>    
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>    
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>    
                    <option value="10">10</option>    
                    <option value="11">11</option>    
                    <option value="12">12</option>    
                </select>
            <small id="helpId" class="form-text text-muted">Por favor seleccione el número de personas</small>
            @error('number_of_people')
                <div class="invalid-feedback">
                    {{ $message }}
                </div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="check_in" class="form-label">Fecha de Ingreso</label>
            <input
                type="date"
                class="form-control @error('check_in') is-invalid @enderror"
                name="check_in"
                id="check_in"
                aria-describedby="helpId"
                value=""  
            />
            @error('check_in')
                <div class="invalid-feedback">
                    {{ $message }}
                </div>
            @enderror
        </div>

        <div class="mb-3">
            <label for="check_out" class="form-label">Fecha de Salida</label>
            <input
                type="date"
                class="form-control @error('check_out') is-invalid @enderror"
                name="check_out"
                id="check_out"
                aria-describedby="helpId"
                value=""  
            />
            @error('check_out')
                <div class="invalid-feedback">
                    {{ $message }}
                </div>
            @enderror
        </div>


        <div class="mb-3">
            <label for="total_price" class="form-label">Precio total</label>
            <input
                type="number"
                class="form-control @error('total_price') is-invalid @enderror"
                name="total_price"
                id="total_price"
                aria-describedby="helpId"
                placeholder="Precio total"
                value=" "  
                readonly
            />
        </div>


        <div class="modal-footer">
            <button type="button" id='reservation' class="btn btn-primary">Reservar</button>
        </div>

        <div id="reservationConfirmation" style="display: none; text-align: center;">
            <div class="reservations">

                <img src="{{asset('img/qr.jpeg')}}" alt="Imagen de confirmación" id="confirmationImage" class="qr-img" />
                <h3 id="total_price_text"> </h3>
            </div>
            <div class="mt-3">
                <button type="button" id="cancelReservation" class="btn btn-danger">Cancelar</button>
                <button type="submit" id="confirmReservation" class="btn btn-success">Confirmar Reserva</button>
            </div>
        </div>
    </form>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const roomTypeSelect = document.getElementById('room_type');
            const priceInput = document.getElementById('price');
            
            const totalPriceInput = document.getElementById('total_price');
            
            roomTypeSelect.addEventListener('change', function () {
                const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
                const price = selectedOption.getAttribute('data-price');
    
                console.log("Precio seleccionado:", price);
                
                if (price) {
                    priceInput.value = price;
                    totalPriceInput.value = priceInput.value;
                } else {
                    priceInput.value = '';
                }
            });
        });

        document.addEventListener('DOMContentLoaded', function () {
            const roomTypeSelect = document.getElementById('room_type');
            const quantityOfRoomsInput = document.querySelector('input[name="number_of_rooms"]');
            const quantityOfPeopleSelect = document.getElementById('number_of_people');

            function updatePeopleOptions() {
                const roomType = roomTypeSelect.value;
                const quantityOfRooms = parseInt(quantityOfRoomsInput.value) || 1; 
                let minPeople = 1;
                let maxPeople = 1;
                
                switch (roomType) {
                    case '1': // Habitación simple
                        minPeople = quantityOfRooms;
                        maxPeople = quantityOfRooms ; 
                        break;
                    case '2': // Habitación doble
                        minPeople = quantityOfRooms * 2;
                        maxPeople = quantityOfRooms * 2;
                        break;
                    case '3': // Habitación triple
                        minPeople = quantityOfRooms * 3;
                        maxPeople = quantityOfRooms * 3; 
                        break;
                    case '4': // Habitación familiar
                        minPeople = quantityOfRooms * 3;
                        maxPeople = quantityOfRooms * 3; 
                        break;
                    case '5': // Suite o King Size
                        minPeople = 1;
                        maxPeople = quantityOfRooms * 2; 
                        break;
                    default:
                        minPeople = 1;
                        maxPeople = 1;
                }

                quantityOfPeopleSelect.innerHTML = '';

                for (let i = minPeople; i <= maxPeople; i++) {
                    let option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    quantityOfPeopleSelect.appendChild(option);
                }
            }

            roomTypeSelect.addEventListener('change', updatePeopleOptions);
            quantityOfRoomsInput.addEventListener('input', updatePeopleOptions);
        });

        document.addEventListener('DOMContentLoaded', function () {
            const roomTypeSelect = document.getElementById('room_type');
            const priceInput = document.getElementById('price');
            const totalPriceInput = document.getElementById('total_price');
            const numberOfPeopleSelect = document.getElementById('number_of_people');
            
            const reservationButton = document.getElementById('reservation');
            const reservationConfirmation = document.getElementById('reservationConfirmation');
            const cancelReservationButton = document.getElementById('cancelReservation');
            const confirmReservationButton = document.getElementById('confirmReservation');
            const totalPriceText = document.getElementById('total_price_text');

            numberOfPeopleSelect.addEventListener('change', function () {
                const selectedValue = numberOfPeopleSelect.value;
                console.log("Nueva cantidad de personas seleccionada:", selectedValue);
            });

            const quantityOfRoomsInput = document.querySelector('input[name="number_of_rooms"]');
            quantityOfRoomsInput.addEventListener('input', function () {
                const currentValue = numberOfPeopleSelect.value;
                console.log("Valor actual de 'number_of_people':", currentValue);
                
                const price = priceInput.value; 
                totalPriceInput.value = price * currentValue; 
            });

            roomTypeSelect.addEventListener('change', function () {
                const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
                const price = selectedOption.getAttribute('data-price');

                console.log("Precio seleccionado:", price);
                
                if (price) {
                    priceInput.value = price;
                    const currentValue = numberOfPeopleSelect.value; 
                    totalPriceInput.value = price * currentValue; 
                } else {
                    priceInput.value = '';
                }
            });

            reservationButton.addEventListener('click', function () {
                const currentValue = numberOfPeopleSelect.value; 
                const currentPrice = priceInput.value; 
                const total = currentPrice * currentValue;

                totalPriceText.textContent = "Total a pagar: Bs." + total.toFixed(2); 
                reservationButton.style.display = 'none';
                reservationConfirmation.style.display = 'block'; 
            });

            
            cancelReservationButton.addEventListener('click', function () {
                reservationConfirmation.style.display = 'none'; 
                reservationButton.style.display = 'block'; 
            });

            confirmReservationButton.addEventListener('click', function () {
                alert('Reserva confirmada!');
                reservationConfirmation.style.display = 'none'; 
                reservationButton.style.display = 'block'; 
            });
        });

    </script>
