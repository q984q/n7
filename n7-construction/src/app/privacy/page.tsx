import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Конфиденциальность и работа с данными | N7 CONSTRUCTION",
  description: "Как каталог N7 CONSTRUCTION обрабатывает сведения, которые пользователь вводит перед запросом коммерческого предложения.",
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <article className="bg-canvas py-28 text-ink">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-track">N7 CONSTRUCTION · Казахстан</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Конфиденциальность и работа с данными</h1>
        <p className="mt-3 text-sm text-ink/65">Краткое и честное описание того, что происходит с данными на этом сайте.</p>
        <div className="mt-8 space-y-6 text-sm leading-7 text-ink/78">
          <section><h2 className="text-base font-extrabold text-ink">Что хранится на устройстве</h2><p>Выбранные позиции для запроса КП и список сравнения сохраняются в локальном хранилище браузера на вашем устройстве. Сайт без дополнительной настройки не отправляет эти сведения на сервер N7. Вы можете очистить их, удалив данные браузера или позиции из списка КП.</p></section>
          <section><h2 className="text-base font-extrabold text-ink">Запрос коммерческого предложения</h2><p>Имя, город, параметры объекта и пожелания, которые вы вводите в форму, остаются на странице до тех пор, пока вы сами не скопируете текст, не сохраните файл или не нажмёте кнопку открытия WhatsApp. При переходе в WhatsApp сведения обрабатываются по правилам соответствующего сервиса. N7 не получает запрос автоматически только потому, что вы открыли страницу.</p></section>
          <section><h2 className="text-base font-extrabold text-ink">Зачем нужны данные</h2><p>Данные используются только для подготовки ответа на вашу заявку: подбор модели и комплектации, расчёт поставки, доставки и монтажа. Не указывайте больше персональных сведений, чем необходимо для запроса.</p></section>
          <section><h2 className="text-base font-extrabold text-ink">Передача третьим лицам</h2><p>Данные передаются третьим лицам только в объёме, который вы сами выбираете при отправке запроса, либо когда это необходимо для исполнения договора: поставщику, перевозчику или монтажной организации.</p></section>
          <section><h2 className="text-base font-extrabold text-ink">Файлы cookies и аналитика</h2><p>На статической версии сайта нет собственных рекламных cookies и серверной базы заявок. Если позже будут подключены аналитика или рекламные кабинеты, на этой странице до их включения будет описано, что именно измеряется и как отказаться от измерения.</p></section>
          <section><h2 className="text-base font-extrabold text-ink">Обращение по данным</h2><p>Чтобы уточнить условия обработки или попросить исправить сведения, используйте контакт, опубликованный на <a className="font-bold text-track underline" href="/contacts/">странице контактов</a>. Полные реквизиты оператора предоставляются по запросу до оформления договора.</p></section>
          <section><h2 className="text-base font-extrabold text-ink">Не является офертой</h2><p>Информация в каталоге носит информационный характер. Конкретная цена, срок поставки, гарантия и условия монтажа действуют только в подписанном коммерческом предложении, договоре и сопроводительных документах N7.</p></section>
        </div>
      </div>
    </article>
  );
}
