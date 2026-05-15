async function sendSTK() {
    const amount = document.getElementById('amount').value;
    const reference = document.getElementById('reference').value;

    const numbers = document
        .getElementById('numbers')
        .value
        .split('\n')
        .filter(n => n.trim() !== '');

    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = 'Sending STK Push requests...';

    try {
        const response = await fetch('/send-bulk-stk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                numbers,
                amount,
                reference
            })
        });

        const data = await response.json();

        resultDiv.innerHTML =
            JSON.stringify(data, null, 2);

    } catch (error) {
        resultDiv.innerHTML = error.message;
    }
}
