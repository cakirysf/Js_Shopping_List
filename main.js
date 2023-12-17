/* Elementleri Tanımlama Seçme */
const form = document.querySelector(".grocery-form");
/* console.log(form) */ /* bu şekilde yapının gelip gelmediği kontrol edilir  */
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery"); /* id alma */
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
/* console.log(clearBtn); */

/* Düzenleme Seçenekleri */
let editElement; /* düzenleme yapılan ögeyi temsil eder */
let editID =
  ""; /* id globelde tanımlayıp içini boş bırakmak benzersiz id yapmak*/
let editFlag = false; /* tıklama olayı sonrası true ye dönerse düzenleme modunda olup olmadığını belirtmek için kullandık SUBMIT olayını izlemek için*/

/* FORM işlemleri "OLAY İZLEYİCİSİ"*/
form.addEventListener(
  "submit",
  addItem
); /* form gönderildiğinde addItem fonksiyonunu çağır */

/* Listeyi temizle butonuna tıklandığında clearItems fonksiyonunu çağırma */
  clearBtn.addEventListener("click", clearItems)

/* Ekran yüklendiğinde ki işlemler window a olay izleyici ekleyeceğiz */
window.addEventListener("DOMContentLoaded", setupItems)


//! FUNCTIONS | FONKSİYONLAR
function addItem(e) {
  e.preventDefault(); /* submit e tıklandığında sayfayı yenilemeyi engelleme*/
  const value = grocery.value; //inputun giriş değerini al
  const id = new Date()
    .getTime()
    .toString(); /* her element için id oluşturma, yazıya çevirmek için id yi toString metodu kullanılır. date fonksiyonu ile benzersiz id oluşturabiliyoruz  */

  /* value boş ise mesaj vereceğiz, editFlag ile tıklanmayı kontrol edeceğiz if yapısı ile */

//! KOŞULLAR  
  if (value !== "" && !editFlag) {
    /* value boş değil ve düzenleme modunda değilse demek ! */
    /* js ile dinamik kısım oluşturma */
    const element = document.createElement("article");
    /* Yeni bir HTML öğesi oluştururken kullandığımız metod createElement*/
    /* article html öğesini oluşturduk */
    let attr =
      document.createAttribute("data-id"); /* özellik ekleme attribute */
    attr.value =
      id; /* Yukarıda oluşturduğumuz id yi data-id ye gönderdik, veri kimliği oluşturmak için */
    element.setAttributeNode(attr); /* oluşturulan data-id yi elemente atadık*/
    /* console.log(element) ile yazdırıldığında <article data-id="2352346254625" class="grocery-item" </article> şeklinde görünür*/
    element.classList.add("grocery-item");
    /* elemente class eklemek için classList.add kullanılır */

    /* article içeriğini değiştirmek için innerHTML yöntemi kullanılır `backtick içinde yazılır` p etiketinin içeriğine ${değer} ile inputtan gelen değeri yazdırmak için bu şekilde kullanıyoruz*/
    element.innerHTML = `
    <p class="title">${value}</p> 
    <div class="btn-container">
        <button class="edit-btn" type="button">
            <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete-btn" type="button">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
    `;

    /* yukarıda edit-btn ve delete-btn tanımlandığı için burada element ile olay izleyici ekleyeceğiz */
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);



    list.appendChild(element) /* oluşturduğumuz elementi listin içine ekliyoruz yani grocery-list sınıfa sahip div içine */

    displayAlert("Başarıyla Eklendi", "success") //dışardan parametre gönderme

    container.classList.add("show-container") // bu şekilde container elementini ekliyoruz
    /* success sonrası ekranda görünmesini sağladık container a show-container eklemiş olduk */

    //localStorage Ekleme
    addToLocalStorage(id, value)

    //input içeriğini temizleme fonskiyonu çalıştırma
    setBackToDefault()
  } /* 2. İF YAPISI */
  else if (value !=="" && editFlag) /* value nin içi boş değilse ve editFlag true ise */{
    /* editItem fonksiyonu ile bu durum oluştu yani içerik boş değil editFlag true oldu */
    editElement.innerHTML=value /* editElement değerini değiştirdik edit/düzenleme çalışıyor */
    displayAlert("Güncelleme Yapıldı", "success")

     /* ekran yüklendiğinde  ki işlem  */
     editLocalStorage(editID, value)
     
    /* şimdi Düzenleme olan butonu ve diğer verileri ekleme haline alma */
    setBackToDefault()
  }  /* 3. İF YAPISI INPUT BOŞ OLMA DURUMU */
  else 
  displayAlert("Lütfen bir değer giriniz", "danger")
}

//ALERT FUNCTION
function displayAlert(text, action) { /* 2 parametre verdik (text, action) mesaj ve css kısmı için */
  alert.textContent = text;  /* mesaj kısmı */
  alert.classList.add(`alert-${action}`); /* eklenen classı action ile alıyoruz danger ve success i ayarlamak için alert-danger, alert-success */
  /* ${action} bu kısma template literals denir yani şablon değişmez değerleri  */
  /* console.log(alert) sonuç = <p class="alert alert-success">Başarıyla Eklendi</p> */
 
  //bu kısımda mesajı 2 sn sildirip, class içeriğini eski haline aldırıyoruz
  setTimeout(function() {
    alert.textContent =""
    alert.classList.remove(`alert-${action}`)
  }, 2000);
}

//İÇERİK TEMİZLEME FONKSİYONU
function setBackToDefault(){
  grocery.value=""
  editFlag=false
  editID=""
  submitBtn.textContent="Ekle" //edit kısmında tekrar eski haline almak için bu şekilde kullandık.
}


// SİLME İŞLEMİ FONKSİYONU
function deleteItem(e) { /* delete butonuna tıklandığında oluşturulan article yi silme işlemlerini yapacağız */
  /* üst kapsayıcıya ulaşarak silme işlemi yapacağız hedef elemente ulaşabilmek için currentTarget kullanımı */
  /* 
  console.log(e.currentTarget.parentElement) //bir üst kapsayıcıya ulaştık
  console.log(e.currentTarget.parentElement.parentElement) //bir üst kapsayıcıya daha ulaşmak için
  */
  const element = e.currentTarget.parentElement.parentElement;

  //elementin id sine ulaşmak için dataSet kullanıyoruz
  const id = element.dataset.id
  /* localStorage te bu id ye göre silme işlemi yapmak için id aldık */

  /* şimdi de elementi kaldırma html içinden silme işlemi yapacağız removeChild */
  list.removeChild(element)

  /* tüm veri sıfırlandığında kalan listeyi temizle butonunu kaldırmak için */
  /* şimdi kapsayıcı içindeki çocuk öğelere ulaşmak için */
  if (list.children.length ==0) /* listedeki kayıt sayısı sıfır ise dedik */{
    container.classList.remove("show-container")
  }

  /* silme işlemi nedeniyle mesaj vermek için tekrar kullanılan fonksiyonu çağırma */  
  displayAlert("Silme İşlemi Başarılı", "danger")

  removeFromLocalStorage(id) // yerel depodan kaldırma

}


//DÜZENLEME İŞLEMİ FONKSİYONU
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement =
    e.currentTarget.parentElement
      .previousElementSibling; /* html içindeki örnek p etiketine ulaşabilmek için elementSibling kullanılır */
  /* şimdi p elementine ulaştık ve düzenleme için aşağıdaki kodları kullanacağız */
  grocery.value = editElement.innerHTML; //input içeriğini editElementin html içeriğine ekledik
  editFlag = true; // true yaparak düzenleme olduğunu belirledik
  editID = element.dataset.id; // id editID ye yollama, düzenlenen elementin kimliği
  submitBtn.textContent = "Düzenle";
  

}


//LİSTEYİ TEMİZLEME FONKSİYONU
function clearItems() {
  /* tümünü silmek için tanımlanan article ya ulaşıp remove yapacağız */
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item); //her öğeyi listeden kaldırır
    });
  }
  container.classList.remove("show-container") //listeyi temizle butonunu kaldırmak için
  displayAlert("Liste Temizlendi", "danger")
  setBackToDefault() // varsayılan değerlere dönmek için 
}

//! Local Storage İşlemleri
//LOCAL STORAGE YE DEĞERLERİ KAYITETME, yerel depoya öğe ekleme
function addToLocalStorage(id, value) {
  /* console.log(id, value) */
  //localStorage değerleri tutmak için bir obje oluşturacağız
  const grocery = {id, value}
  let items = getLocalStorage()  //yeni bir değer oluşturup fonksiyon oluşturma
  /* items ı almak için json yapısı kullanılır medot olarak push kullanılır */
  items.push(grocery)
  localStorage.setItem("list", JSON.stringify(items) )    /* localStroge veri eklerken setItem kullanılır */
}

function getLocalStorage() {
  return localStorage.getItem("list") ?  JSON.parse(localStorage.getItem("list"))
  : []
  /* ile localstorage da list varsa bunu json parse ile çevirsin eski haline yoksada boş bir dizi göndersin diyoruz bu fonksiyon ile  */
  
}

/* kayıtlardaki id ile localstorage içindeki id leri karşılaştırıp id den kaydı getirme */
function removeFromLocalStorage(id) {
  let items=getLocalStorage()
  items=items.filter(function(item){
    if (item.id !== id) {
      return item
      
    }
  })
}

function editLocalStorage(id, value) {

  
}

function setupItems() {
  let items=getLocalStorage()
}