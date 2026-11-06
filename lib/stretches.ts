export type BodyPartId = "neck" | "back" | "waist" | "legs";
export type Minutes = 3 | 5 | 10;

/** ストレッチの元データ。sided=true のものは左右それぞれ30秒、それ以外は60秒で実施する。 */
type StretchSource = {
  id: string;
  name: string;
  posture: string;
  instructions: string[];
  /** 秒数ではなく回数で行う動きの目安（任意） */
  reps?: string;
  caution: string;
  sided: boolean;
};

export type BodyPart = {
  id: BodyPartId;
  label: string;
  description: string;
  stretches: StretchSource[];
};

/** 実際にタイマーで進める1ステップ */
export type MenuStep = {
  key: string;
  name: string;
  side?: "右" | "左";
  posture: string;
  instructions: string[];
  reps?: string;
  caution: string;
  seconds: number;
  round: number;
};

export const MINUTES_OPTIONS: Minutes[] = [3, 5, 10];

export const BODY_PARTS: BodyPart[] = [
  {
    id: "neck",
    label: "首・肩",
    description: "デスクワークやスマホで固まりやすい首まわりに",
    stretches: [
      {
        id: "neck-side",
        name: "首の横のばし",
        posture: "椅子に座って",
        instructions: [
          "背すじを伸ばし、肩の力を抜きます。",
          "頭をゆっくり横に倒し、首の横がじんわり伸びるところで止めます。",
          "ゆっくり呼吸しながらキープします。",
        ],
        caution: "手で頭を強く引っぱらないでください。しびれやめまいを感じたら中止しましょう。",
        sided: true,
      },
      {
        id: "shoulder-roll",
        name: "肩まわし",
        posture: "椅子に座って / 立って",
        instructions: [
          "両手を肩に軽くのせます。",
          "ひじで大きな円を描くように、ゆっくり後ろへ回します。",
          "途中で前回しに切り替えてもかまいません。",
        ],
        reps: "1周5秒くらいのペースで",
        caution: "肩に引っかかりや痛みがある場合は、小さな円で行いましょう。",
        sided: false,
      },
      {
        id: "arm-cross",
        name: "腕のクロスのばし",
        posture: "椅子に座って / 立って",
        instructions: [
          "片方の腕を胸の前でまっすぐ伸ばします。",
          "反対の腕でひじのあたりを支え、胸のほうへ軽く引き寄せます。",
          "肩の後ろが伸びるのを感じながらキープします。",
        ],
        caution: "ひじの関節を押さえつけず、腕の上のほうを支えましょう。",
        sided: true,
      },
      {
        id: "shoulder-shrug",
        name: "肩のストン運動",
        posture: "椅子に座って",
        instructions: [
          "息を吸いながら、両肩を耳に近づけるように持ち上げます。",
          "3秒ほど止めたら、息を吐きながらストンと力を抜きます。",
          "これをくり返します。",
        ],
        reps: "6〜8回くらい",
        caution: "首に力が入りすぎないよう、ゆっくり行いましょう。",
        sided: false,
      },
      {
        id: "chest-open",
        name: "胸ひらき",
        posture: "椅子に座って",
        instructions: [
          "両手を腰の後ろに当てます（できる方は背中側で手を組みます）。",
          "手を組むのが難しい場合は、手を組まずに両腕を軽く後ろへ引くだけでも大丈夫です。",
          "肩甲骨を寄せるようにして、胸を前にゆっくり開きます。",
          "あごは軽く引いたまま、呼吸を続けます。",
        ],
        caution: "腰を反らしすぎないようにしましょう。肩が痛む場合は手を組まず、両腕を軽く後ろへ引くだけにしましょう。",
        sided: false,
      },
    ],
  },
  {
    id: "back",
    label: "背中",
    description: "丸まりがちな背中をやさしくほぐします",
    stretches: [
      {
        id: "back-round",
        name: "背中まるめ",
        posture: "椅子に座って",
        instructions: [
          "両手を体の前で組み、腕を前に伸ばします。",
          "おへそをのぞきこむように背中を丸め、手を遠くへ押し出します。",
          "肩甲骨のあいだが伸びるのを感じながらキープします。",
        ],
        caution: "息を止めず、ゆっくり呼吸を続けましょう。",
        sided: false,
      },
      {
        id: "overhead-reach",
        name: "背のび",
        posture: "椅子に座って / 立って",
        instructions: [
          "両手を組み、手のひらを上に向けて頭の上へ伸ばします。",
          "天井から引っぱられるイメージで、体を上に伸ばします。",
          "肩の力は抜いたまま、ゆっくり呼吸します。",
        ],
        caution: "肩が上がりにくい方は、無理のない高さまででかまいません。",
        sided: false,
      },
      {
        id: "side-bend",
        name: "体の横のばし",
        posture: "椅子に座って",
        instructions: [
          "片手を上に伸ばし、反対の手は椅子の座面に置きます。",
          "上げた手の方向へ、上体をゆっくり横に倒します。",
          "わき腹から背中の横が伸びるところでキープします。",
        ],
        caution: "体が前に倒れないよう、まっすぐ横へ倒しましょう。",
        sided: true,
      },
      {
        id: "seated-twist",
        name: "座ってひねり",
        posture: "椅子に座って",
        instructions: [
          "椅子に浅めに座り、背すじを伸ばします。",
          "息を吐きながら、上体をゆっくり横にひねります。痛みが出ない範囲で止めましょう。",
          "背もたれや太ももに手を添えて、姿勢を支えます。",
        ],
        caution: "腰を無理に深くひねらないでください。手で勢いをつけず、痛みが出ない範囲でゆっくり行いましょう。腰に痛みが出たら中止します。",
        sided: true,
      },
    ],
  },
  {
    id: "waist",
    label: "腰",
    description: "座りっぱなしで重くなった腰まわりに",
    stretches: [
      {
        id: "knee-hug",
        name: "ひざかかえ",
        posture: "仰向けに寝て",
        instructions: [
          "仰向けになり、両ひざを立てます。",
          "両手で両ひざを抱え、胸のほうへゆっくり引き寄せます。",
          "腰が床にやさしく伸びるのを感じながらキープします。",
        ],
        caution: "ひざが痛む場合は、ひざ裏をもって引き寄せましょう。",
        sided: false,
      },
      {
        id: "single-knee",
        name: "片ひざかかえ",
        posture: "仰向けに寝て",
        instructions: [
          "仰向けで、片方のひざを両手で抱えます。",
          "反対の脚は、ひざを立てるか床に伸ばします。",
          "抱えたひざを胸へゆっくり引き寄せてキープします。",
        ],
        caution: "頭や肩は床につけたまま、力を抜いて行いましょう。",
        sided: true,
      },
      {
        id: "knee-drop",
        name: "ひざ倒しひねり",
        posture: "仰向けに寝て",
        instructions: [
          "仰向けで両ひざを立て、両腕を横に広げます。",
          "両ひざをそろえたまま、ゆっくり横に倒します。ひざが床につかなくても大丈夫です。",
          "肩は床につけたまま、腰の横が伸びるところでキープします。",
        ],
        caution: "ひざを床につけようと無理をしないでください。倒せるところまでで十分です。勢いをつけず、腰に痛みや違和感が出たら中止しましょう。",
        sided: true,
      },
      {
        id: "seated-forward",
        name: "座って前たおし",
        posture: "椅子に座って",
        instructions: [
          "椅子に座り、足を肩幅に開きます。",
          "息を吐きながら、上体をゆっくり前へ倒します。浅く倒すだけでもかまいません。",
          "腕と頭の力を抜き、腰から背中が伸びるのを感じます。",
          "戻るときは、太ももに手をついてゆっくり起き上がります。",
        ],
        caution: "頭を下げるとふらつく場合は、浅い前傾にするか中止してください。血圧が気になる方も浅めに行いましょう。起き上がるときは急がず、ゆっくり戻りましょう。",
        sided: false,
      },
    ],
  },
  {
    id: "legs",
    label: "脚",
    description: "むくみやすい脚の筋肉をのばします",
    stretches: [
      {
        id: "hamstring",
        name: "もも裏のばし",
        posture: "椅子に座って",
        instructions: [
          "椅子に浅く座り、片脚をまっすぐ前に伸ばしてかかとを床につけます。",
          "背すじを伸ばしたまま、足の付け根から上体を少し前に倒します。",
          "太ももの裏が伸びるところでキープします。",
        ],
        caution: "背中を丸めて無理に倒さないようにしましょう。",
        sided: true,
      },
      {
        id: "calf",
        name: "ふくらはぎのばし",
        posture: "立って（壁に手をついて）",
        instructions: [
          "壁に両手をつき、片脚を後ろに引きます。",
          "後ろ脚のかかとを床につけたまま、前のひざをゆっくり曲げます。",
          "ふくらはぎが伸びるところでキープします。",
        ],
        caution: "転ばないよう、必ず壁や椅子で体を支えて行いましょう。",
        sided: true,
      },
      {
        id: "ankle-roll",
        name: "足首まわし",
        posture: "椅子に座って",
        instructions: [
          "椅子に座り、片脚を反対の太ももにのせます（難しければ床につけたままで）。",
          "足の指と手の指を組むか、つま先で円を描くように足首を回します。",
          "途中で反対回りにします。",
        ],
        reps: "右回し・左回し 各5回くらい",
        caution: "足首に痛みがある場合は、小さく回しましょう。",
        sided: true,
      },
      {
        id: "quad",
        name: "もも前のばし",
        posture: "立って（椅子や壁につかまって）",
        instructions: [
          "椅子の背もたれや壁に片手でつかまり、体をしっかり支えます。",
          "反対の手で同じ側の足首（または靴下・ズボンのすそ）を持ちます。",
          "かかとをお尻に近づけ、太ももの前が伸びるところでキープします。",
        ],
        caution: "足首を持つのが難しい場合は、無理に行わないでください。必ず椅子や壁で体を支え、ふらつく場合は中止しましょう。ひざが痛む場合も中止します。",
        sided: true,
      },
    ],
  },
];

const SIDED_SECONDS = 30;
const SINGLE_SECONDS = 60;

export function getBodyPart(id: BodyPartId): BodyPart {
  const part = BODY_PARTS.find((p) => p.id === id);
  if (!part) throw new Error(`Unknown body part: ${id}`);
  return part;
}

/**
 * 部位と時間からメニューを作る。
 * 1種類のストレッチ = 60秒（左右あるものは左右30秒ずつ）として、
 * 指定時間に達するまで順番にくり返す。
 */
export function buildMenu(partId: BodyPartId, minutes: Minutes): MenuStep[] {
  const { stretches } = getBodyPart(partId);
  const units = minutes; // 1分 = 1種類
  const steps: MenuStep[] = [];

  for (let i = 0; i < units; i++) {
    const s = stretches[i % stretches.length];
    const round = Math.floor(i / stretches.length) + 1;
    const base = {
      name: s.name,
      posture: s.posture,
      instructions: s.instructions,
      reps: s.reps,
      caution: s.caution,
      round,
    };
    if (s.sided) {
      steps.push({ ...base, key: `${i}-R`, side: "右", seconds: SIDED_SECONDS });
      steps.push({ ...base, key: `${i}-L`, side: "左", seconds: SIDED_SECONDS });
    } else {
      steps.push({ ...base, key: `${i}`, seconds: SINGLE_SECONDS });
    }
  }
  return steps;
}

export const GENERAL_CAUTIONS = [
  "痛みや違和感が出たら、すぐに中止してください。",
  "反動をつけず、「気持ちよく伸びている」程度で止めましょう。",
  "呼吸を止めず、ゆっくり続けましょう。",
  "持病のある方、治療中の方、体調に不安がある方は、医師に相談のうえ行ってください。",
  "食後すぐや、体調がすぐれないときは控えましょう。",
];
