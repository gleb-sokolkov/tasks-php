const text = `
  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rerum, molestiae aliquid! 
  Excepturi, earum dignissimos libero laudantium et temporibus esse exercitationem 
  animi veniam eaque a nam dicta fugiat explicabo unde delectus veritatis distinctio, 
  laborum consectetur! Repellat impedit quos excepturi? Molestiae totam nihil enim, 
  sapiente asperiores adipisci cupiditate sit aliquid iure vitae voluptate beatae tenetur 
  vero minima ratione ullam magni pariatur numquam corrupti consequatur libero eaque.
`.replace(/\n/g, '');

const string = document.querySelector('[data-type="string"]');
const searchBtn = document.querySelector('[data-type="search"]');
const body = document.querySelector('[data-type="body"]');

body.innerText = text;

string.oninput = request;
searchBtn.onclick = request; 

async function request() {
  try {
    const response = await fetch('search.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ search: string.value, text }),
    });
    const t = await response.text();
    body.innerHTML = t;
  } catch (response) {
    console.error(response.message);
  }
}