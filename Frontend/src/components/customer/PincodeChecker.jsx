import { useState } from "react";

const KOLKATA_PINCODES = {
    "700001": "BBD Bagh", "700002": "GPO Kolkata", "700003": "Princep Street",
    "700004": "Strand Road", "700005": "Kalighat", "700006": "Beniapukur",
    "700007": "Bowbazar", "700008": "Kidderpore", "700009": "Hastings",
    "700010": "Maidan", "700011": "Alipore", "700012": "Bhowanipore",
    "700013": "Park Street", "700014": "Ballygunge", "700015": "Gariahat",
    "700016": "Dhakuria", "700017": "Jadavpur", "700018": "Tollygunge",
    "700019": "Entally", "700020": "Tangra", "700021": "Topsia",
    "700022": "New Alipore", "700023": "Garden Reach", "700024": "Metiabruz",
    "700025": "Santoshpur", "700026": "Behala", "700027": "Sealdah",
    "700028": "Maniktala", "700029": "Belgachia", "700030": "Cossipore",
    "700031": "Bagbazar", "700032": "Baranagar", "700033": "Sodepur",
    "700034": "Dum Dum", "700035": "Lake Town", "700036": "Shyambazar",
    "700037": "Belgharia", "700038": "Kamarhati", "700039": "Dakshineswar",
    "700040": "Howrah", "700041": "Liluah", "700042": "Shibpur",
    "700043": "Bally", "700044": "Uttarpara", "700045": "Rishra",
    "700046": "Kasba", "700047": "Garia", "700048": "Narendrapur",
    "700049": "Sonarpur", "700050": "Baruipur", "700051": "Rajpur",
    "700052": "Jodhpur Park", "700053": "Regent Park", "700054": "VIP Nagar",
    "700055": "Ultadanga", "700056": "Phoolbagan", "700057": "CIT Road",
    "700058": "Baguiati", "700059": "Keshtopur", "700060": "Nager Bazar",
    "700064": "Madhyamgram", "700065": "Airport", "700066": "Rajarhat",
    "700067": "New Town", "700068": "Barasat", "700069": "Habra",
    "700070": "Hridaypur", "700071": "Salt Lake Sec V", "700072": "Salt Lake Sec III",
    "700073": "Mukundapur", "700074": "Patuli", "700075": "Picnic Garden",
    "700076": "Park Circus", "700077": "Bansdroni", "700078": "Thakurpukur",
    "700079": "Joka", "700080": "Taratala", "700082": "Maheshtala",
    "700084": "Budge Budge", "700086": "Salt Lake", "700091": "Sector V Salt Lake",
    "700094": "Rajarhat Gopalpur", "700097": "New Town Action Area",
    "700098": "Eco Park", "700099": "Newtown Kolkata",
    "700100": "South City", "700101": "EM Bypass", "700102": "Ruby",
    "700103": "Anandapur", "700104": "Science City", "700105": "Chingrighata",
    "700106": "Bantala", "700107": "Kamalgazi", "700108": "Narayantala",
    "700109": "Baghajatin", "700110": "Netaji Nagar", "700150": "Jatragachi",
    "700152": "Teghoria", "700153": "Haldiram", "700154": "Chinar Park",
    "700155": "Birati", "700156": "Dumdum Cantonment", "700157": "Nagerbazar",
};

const PincodeChecker = () => {
    const [pincode, setPincode] = useState("");
    const [result, setResult] = useState(null); // { available: bool, message: string }

    const handleCheck = () => {
        if (pincode.length !== 6) {
            setResult({ available: false, message: "Please enter a valid 6-digit pincode" });
            return;
        }
        const area = KOLKATA_PINCODES[pincode];
        if (area) {
            setResult({ available: true, message: `Delivery available to ${area}, Kolkata` });
        } else {
            setResult({ available: false, message: "Sorry, delivery is not available at this pincode" });
        }
    };

    return (
        <div className="border-t border-slate-700 pt-3">
            <label className="text-xs text-slate-400 block mb-1.5">Check Delivery Availability</label>
            <div className="space-y-2">
                <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                        setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setResult(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    className="w-full px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <button
                    onClick={handleCheck}
                    disabled={pincode.length < 6}
                    className="w-full py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm font-medium hover:bg-indigo-500/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Check
                </button>
            </div>

            {result && (
                <div className={`mt-2 flex items-start gap-1.5 text-xs ${result.available ? "text-emerald-400" : "text-red-400"}`}>
                    {result.available ? (
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    <span>{result.message}</span>
                </div>
            )}
        </div>
    );
};

export default PincodeChecker;
