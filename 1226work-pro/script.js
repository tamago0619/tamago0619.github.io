let number = 0;
// 左邊 || Pre
number--;
if (number < 0) {
  // 當number等於負數時，則會回到最後一張
  number = carousel01.length - 1;
}

// 右邊 || Next
number++;
if (number > carousel01.length - 1) {
  // 反之，當number大於最大值時，則會回到第一張
  number = 0;
}

carousel01.forEach((carousel) => {
  carousel.classList.remove("active");
  carousel01[number].classList.add("active");
});

// 選取所有卡片元素
const cards = document.querySelectorAll(".card");

// 為每張卡片添加點擊事件監聽器
cards.forEach((card) => {
  card.addEventListener("click", () => {
    alert("你點擊了卡片！"); // 彈出視窗（可換成其他動作）
  });
});
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    alert("你點擊了卡片！");
  });
});
