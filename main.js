const ads = Array.from(document.getElementsByClassName('adsbygoogle'));

// const pageOptions = {
//   pubId: 'pub-9616389000213823', // Make sure this the correct client ID!
//   query: 'hotels',
//   adPage: 1
// };

// ads.map(el => el.id).forEach(id => {
//   _googCsa(
//     'ads',
//     pageOptions,
//     {
//       container: id,
//       width: 700,
//       number: id + 1
//     }
//   );
// });
for (let i = 0; i < 20; i++) {
  (adsbygoogle = window.adsbygoogle || []).push({});
}
