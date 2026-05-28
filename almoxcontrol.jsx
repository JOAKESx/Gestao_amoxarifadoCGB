import { useState } from "react";
import {
  LayoutDashboard, ArrowUpRight, ArrowDownLeft, History,
  Package, Plus, Trash2, Check, AlertCircle, ClipboardList,
  ChevronDown, ChevronRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const OBRAS = [
  { id: "OB-001", nome: "Extensão de Rede – Setor Novo",         encarregado: "Carlos Mendes",   status: "ativo",     inicio: "12/05/2026", prev: "30/06/2026" },
  { id: "OB-002", nome: "Instalação Transformador – Centro",     encarregado: "José Silva",      status: "ativo",     inicio: "20/05/2026", prev: "15/06/2026" },
  { id: "OB-003", nome: "Manutenção Preventiva – Zona Rural",    encarregado: "Antonio Pereira", status: "concluida", inicio: "01/05/2026", prev: "20/05/2026" },
];

const MATERIAIS = [
  { id: "M001", nome: "Cabo XLPE 35mm²",        un: "m",  estoque: 850  },
  { id: "M002", nome: "Poste de Concreto 11m",  un: "un", estoque: 12   },
  { id: "M003", nome: "Cruzeta de Madeira 2,4m",un: "un", estoque: 45   },
  { id: "M004", nome: "Transformador 75kVA",    un: "un", estoque: 3    },
  { id: "M005", nome: "Isolador de Porcelana",  un: "un", estoque: 210  },
  { id: "M006", nome: "Conector de Perfuração", un: "un", estoque: 320  },
  { id: "M007", nome: "Fio Neutro 16mm²",       un: "m",  estoque: 1200 },
  { id: "M008", nome: "Disjuntor 100A",         un: "un", estoque: 18   },
];

const HISTORICO = [
  { id: 1, data: "27/05/2026", tipo: "saida",    obra: "OB-001", obraNome: "Extensão de Rede – Setor Novo",     encarregado: "Carlos Mendes",   itens: [{ mat: "Cabo XLPE 35mm²", qtd: 200, un: "m" }, { mat: "Isolador de Porcelana", qtd: 30, un: "un" }] },
  { id: 2, data: "27/05/2026", tipo: "saida",    obra: "OB-001", obraNome: "Extensão de Rede – Setor Novo",     encarregado: "Carlos Mendes",   itens: [{ mat: "Conector de Perfuração", qtd: 40, un: "un" }] },
  { id: 3, data: "26/05/2026", tipo: "devolucao",obra: "OB-003", obraNome: "Manutenção Preventiva – Zona Rural",encarregado: "Antonio Pereira", itens: [{ mat: "Conector de Perfuração", qtd: 15, un: "un" }, { mat: "Cruzeta de Madeira 2,4m", qtd: 5, un: "un" }] },
  { id: 4, data: "25/05/2026", tipo: "saida",    obra: "OB-002", obraNome: "Instalação Transformador – Centro", encarregado: "José Silva",      itens: [{ mat: "Transformador 75kVA", qtd: 1, un: "un" }, { mat: "Disjuntor 100A", qtd: 4, un: "un" }] },
  { id: 5, data: "23/05/2026", tipo: "devolucao",obra: "OB-003", obraNome: "Manutenção Preventiva – Zona Rural",encarregado: "Antonio Pereira", itens: [{ mat: "Cruzeta de Madeira 2,4m", qtd: 5, un: "un" }] },
];

const CHART_DATA = [
  { name: "OB-001", Saídas: 8,  Devoluções: 0 },
  { name: "OB-002", Saídas: 5,  Devoluções: 1 },
  { name: "OB-003", Saídas: 12, Devoluções: 7 },
];

const PLANEJAMENTO = [
  { obraId: "OB-001", itens: [
    { mat: "Cabo XLPE 35mm²",        un: "m",  planejado: 600, usado: 200 },
    { mat: "Poste de Concreto 11m",  un: "un", planejado: 8,   usado: 0   },
    { mat: "Isolador de Porcelana",  un: "un", planejado: 80,  usado: 30  },
    { mat: "Conector de Perfuração", un: "un", planejado: 100, usado: 40  },
  ]},
  { obraId: "OB-002", itens: [
    { mat: "Transformador 75kVA",    un: "un", planejado: 1,  usado: 1  },
    { mat: "Disjuntor 100A",         un: "un", planejado: 6,  usado: 4  },
    { mat: "Fio Neutro 16mm²",       un: "m",  planejado: 200,usado: 0  },
  ]},
  { obraId: "OB-003", itens: [
    { mat: "Cruzeta de Madeira 2,4m",un: "un", planejado: 20, usado: 20 },
    { mat: "Conector de Perfuração", un: "un", planejado: 50, usado: 35 },
    { mat: "Cabo XLPE 35mm²",        un: "m",  planejado: 300,usado: 300},
  ]},
];

// ─── Shared styles ───────────────────────────────────────────────────────────
const S = {
  card: { background: "white", borderRadius: 12, border: "0.5px solid #E8DDE2", overflow: "hidden" },
  label: { display: "block", fontSize: 13, fontWeight: 500, color: "#1A0A10", marginBottom: 8 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #E8DDE2", fontSize: 14, color: "#1A0A10", background: "white", boxSizing: "border-box" },
  btnPrimary: (disabled) => ({
    background: disabled ? "#E8DDE2" : "#8B1A4A",
    color: disabled ? "#9E8590" : "white",
    border: "none", padding: "10px 24px", borderRadius: 8,
    fontSize: 14, fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
  }),
  btnGhost: { background: "none", border: "0.5px solid #E8DDE2", padding: "10px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#7B5A67" },
  tag: (tipo) => ({
    fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500,
    background: tipo === "saida" ? "#FFF0F4" : "#F0FFF6",
    color: tipo === "saida" ? "#8B1A4A" : "#1A6B3A",
    display: "inline-flex", alignItems: "center", gap: 4,
  }),
  pageTitle: { fontSize: 22, fontWeight: 600, color: "#1A0A10", marginBottom: 4, marginTop: 0 },
  pageSub: { color: "#7B5A67", fontSize: 14, marginBottom: 28, marginTop: 0 },
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <div style={{ padding: 28, overflowY: "auto", height: "100%" }}>
      <p style={S.pageTitle}>Painel Geral</p>
      <p style={S.pageSub}>Controle de Materiais — Almoxarifado</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Tipos em Estoque",   value: "8",  sub: "materiais cadastrados",  color: "#8B1A4A" },
          { label: "Saídas este Mês",    value: "25", sub: "movimentações",           color: "#1A5C8B" },
          { label: "Devoluções",         value: "2",  sub: "este mês",                color: "#B45309" },
          { label: "Obras Ativas",       value: "2",  sub: "1 concluída",             color: "#1A6B3A" },
        ].map((c, i) => (
          <div key={i} style={{ ...S.card, padding: "18px 20px" }}>
            <p style={{ color: "#7B5A67", fontSize: 11, fontWeight: 500, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</p>
            <p style={{ fontSize: 30, fontWeight: 700, color: c.color, margin: "0 0 4px" }}>{c.value}</p>
            <p style={{ fontSize: 12, color: "#9E8590", margin: 0 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
        {/* Recent movements */}
        <div style={S.card}>
          <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #F0EAED" }}>
            <p style={{ fontWeight: 500, fontSize: 14, color: "#1A0A10", margin: 0 }}>Movimentações Recentes</p>
          </div>
          {HISTORICO.slice(0, 5).map(mov => (
            <div key={mov.id} style={{ padding: "12px 20px", borderBottom: "0.5px solid #F6F2F4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: mov.tipo === "saida" ? "#FFF0F4" : "#F0FFF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {mov.tipo === "saida" ? <ArrowUpRight size={14} color="#8B1A4A" /> : <ArrowDownLeft size={14} color="#1A6B3A" />}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "#1A0A10", margin: 0 }}>{mov.obra}</p>
                  <p style={{ fontSize: 12, color: "#9E8590", margin: 0 }}>{mov.encarregado}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={S.tag(mov.tipo)}>{mov.tipo === "saida" ? "Saída" : "Devolução"}</span>
                <p style={{ fontSize: 11, color: "#9E8590", margin: "4px 0 0" }}>{mov.data}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + stock alert */}
        <div style={S.card}>
          <div style={{ padding: "18px 20px", borderBottom: "0.5px solid #F0EAED" }}>
            <p style={{ fontWeight: 500, fontSize: 14, color: "#1A0A10", margin: 0 }}>Movimentações por Obra</p>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={CHART_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EAED" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9E8590" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9E8590" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ border: "0.5px solid #E8DDE2", borderRadius: 8, boxShadow: "none", fontSize: 12 }} />
                <Bar dataKey="Saídas"    fill="#8B1A4A" radius={[4,4,0,0]} />
                <Bar dataKey="Devoluções" fill="#D4A0B4" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: "14px 20px", borderTop: "0.5px solid #F0EAED" }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: "#7B5A67", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Estoque Crítico (abaixo de 20)</p>
            {MATERIAIS.filter(m => m.estoque < 20).map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#1A0A10" }}>{m.nome}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#B45309", background: "#FFF7ED", padding: "2px 8px", borderRadius: 6 }}>{m.estoque} {m.un}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Registrar Saída ──────────────────────────────────────────────────────────
function RegistrarSaida() {
  const [step, setStep]       = useState(1);
  const [obraId, setObraId]   = useState("");
  const [itens, setItens]     = useState([{ matId: "", qtd: "" }]);
  const [concluido, setConcluido] = useState(false);

  const obra = OBRAS.find(o => o.id === obraId);
  const itensValidos = itens.every(i => i.matId && i.qtd);

  const addItem    = () => setItens([...itens, { matId: "", qtd: "" }]);
  const removeItem = (i) => setItens(itens.filter((_, idx) => idx !== i));
  const updateItem = (i, f, v) => { const u = [...itens]; u[i] = { ...u[i], [f]: v }; setItens(u); };

  if (concluido) return (
    <div style={{ padding: 28, display: "flex", alignItems: "center", justifyContent: "center", height: "80%" }}>
      <div style={{ textAlign: "center", maxWidth: 380 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FFF6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Check size={32} color="#1A6B3A" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1A0A10", marginBottom: 8 }}>Saída Registrada!</h2>
        <p style={{ color: "#7B5A67", fontSize: 14, marginBottom: 24 }}>O estoque foi atualizado em tempo real e a movimentação foi salva no histórico.</p>
        <button onClick={() => { setStep(1); setObraId(""); setItens([{ matId: "", qtd: "" }]); setConcluido(false); }} style={S.btnPrimary(false)}>
          Nova Saída
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 28, maxWidth: 620 }}>
      <p style={S.pageTitle}>Registrar Saída</p>
      <p style={S.pageSub}>Registre a retirada de materiais para uma obra</p>

      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        {["Obra & Equipe", "Materiais", "Confirmação"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "initial" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > i+1 ? "#1A6B3A" : step === i+1 ? "#8B1A4A" : "#E8DDE2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: step >= i+1 ? "white" : "#9E8590" }}>
                {step > i+1 ? <Check size={13} /> : i+1}
              </div>
              <span style={{ fontSize: 13, color: step === i+1 ? "#1A0A10" : "#9E8590", fontWeight: step === i+1 ? 500 : 400 }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: step > i+1 ? "#1A6B3A" : "#E8DDE2", margin: "0 14px" }} />}
          </div>
        ))}
      </div>

      <div style={{ ...S.card, padding: 24 }}>
        {step === 1 && <>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>Obra *</label>
            <select value={obraId} onChange={e => setObraId(e.target.value)} style={S.input}>
              <option value="">Selecione a obra...</option>
              {OBRAS.filter(o => o.status === "ativo").map(o => <option key={o.id} value={o.id}>{o.id} – {o.nome}</option>)}
            </select>
          </div>
          {obra && (
            <div style={{ background: "#FBF0F4", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#8B1A4A", fontWeight: 500, margin: "0 0 4px" }}>Encarregado responsável</p>
              <p style={{ fontSize: 14, color: "#1A0A10", fontWeight: 600, margin: 0 }}>{obra.encarregado}</p>
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <button disabled={!obraId} onClick={() => setStep(2)} style={S.btnPrimary(!obraId)}>Próximo →</button>
          </div>
        </>}

        {step === 2 && <>
          <div style={{ background: "#FBF0F4", borderRadius: 8, padding: "8px 14px", marginBottom: 20, display: "inline-block" }}>
            <span style={{ fontSize: 12, color: "#8B1A4A", fontWeight: 500 }}>{obra?.id} — {obra?.nome}</span>
          </div>
          <label style={S.label}>Materiais *</label>
          {itens.map((item, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px auto", gap: 10, marginBottom: 10, alignItems: "center" }}>
              <select value={item.matId} onChange={e => updateItem(i, "matId", e.target.value)} style={{ ...S.input }}>
                <option value="">Selecione o material...</option>
                {MATERIAIS.map(m => <option key={m.id} value={m.id}>{m.nome} — {m.estoque} {m.un} em estoque</option>)}
              </select>
              <input type="number" min="1" placeholder="Qtd" value={item.qtd} onChange={e => updateItem(i, "qtd", e.target.value)} style={{ padding: "10px 12px", borderRadius: 8, border: "0.5px solid #E8DDE2", fontSize: 14, color: "#1A0A10" }} />
              {itens.length > 1 && <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9E8590", padding: 4 }}><Trash2 size={16} /></button>}
            </div>
          ))}
          <button onClick={addItem} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "0.5px dashed #D4BBCA", borderRadius: 8, padding: "8px 16px", color: "#7B5A67", fontSize: 13, cursor: "pointer", width: "100%", justifyContent: "center", marginBottom: 24 }}>
            <Plus size={14} /> Adicionar material
          </button>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={S.btnGhost}>← Voltar</button>
            <button disabled={!itensValidos} onClick={() => setStep(3)} style={S.btnPrimary(!itensValidos)}>Próximo →</button>
          </div>
        </>}

        {step === 3 && <>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#1A0A10", marginBottom: 16 }}>Resumo da saída</p>
          <div style={{ background: "#F6F4F2", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
            {[["Obra", `${obra?.id} — ${obra?.nome}`], ["Encarregado", obra?.encarregado], ["Data/Hora", `28/05/2026 — ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#7B5A67" }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1A0A10" }}>{v}</span>
              </div>
            ))}
          </div>
          {itens.map((item, i) => {
            const mat = MATERIAIS.find(m => m.id === item.matId);
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "0.5px solid #F0EAED" }}>
                <span style={{ fontSize: 13, color: "#1A0A10" }}>{mat?.nome}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#8B1A4A" }}>{item.qtd} {mat?.un}</span>
              </div>
            );
          })}
          <div style={{ background: "#FBF0F4", borderRadius: 8, padding: "12px 16px", marginTop: 16, marginBottom: 20, display: "flex", gap: 8 }}>
            <AlertCircle size={16} color="#8B1A4A" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: "#8B1A4A", margin: 0 }}>
              O encarregado <strong>{obra?.encarregado}</strong> confirma digitalmente a retirada. O estoque será atualizado imediatamente.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(2)} style={S.btnGhost}>← Voltar</button>
            <button onClick={() => setConcluido(true)} style={S.btnPrimary(false)}><Check size={15} /> Confirmar Saída</button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ─── Registrar Devolução ─────────────────────────────────────────────────────
function RegistrarDevolucao() {
  const [obraId, setObraId]   = useState("");
  const [itens, setItens]     = useState([{ matId: "", qtd: "" }]);
  const [concluido, setConcluido] = useState(false);

  const itensValidos = obraId && itens.every(i => i.matId && i.qtd);
  const addItem    = () => setItens([...itens, { matId: "", qtd: "" }]);
  const removeItem = (i) => setItens(itens.filter((_, idx) => idx !== i));
  const updateItem = (i, f, v) => { const u = [...itens]; u[i] = { ...u[i], [f]: v }; setItens(u); };

  if (concluido) return (
    <div style={{ padding: 28, display: "flex", alignItems: "center", justifyContent: "center", height: "80%" }}>
      <div style={{ textAlign: "center", maxWidth: 380 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FFF6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Check size={32} color="#1A6B3A" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1A0A10", marginBottom: 8 }}>Devolução Registrada!</h2>
        <p style={{ color: "#7B5A67", fontSize: 14, marginBottom: 24 }}>Os materiais foram reinseridos no estoque com sucesso. O saldo foi atualizado.</p>
        <button onClick={() => { setObraId(""); setItens([{ matId: "", qtd: "" }]); setConcluido(false); }} style={{ ...S.btnPrimary(false), background: "#1A6B3A" }}>
          Nova Devolução
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 28, maxWidth: 560 }}>
      <p style={S.pageTitle}>Registrar Devolução</p>
      <p style={S.pageSub}>Registre a entrada de materiais sobressalentes de obras</p>

      <div style={{ ...S.card, padding: 24 }}>
        <div style={{ background: "#F0FFF6", border: "0.5px solid #86EFAC", borderRadius: 8, padding: "10px 14px", marginBottom: 22, display: "flex", gap: 8 }}>
          <AlertCircle size={15} color="#1A6B3A" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: "#1A6B3A", margin: 0 }}>
            A devolução registra a <strong>entrada</strong> dos materiais no estoque — o saldo é aumentado, não reduzido.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={S.label}>Obra de Origem *</label>
          <select value={obraId} onChange={e => setObraId(e.target.value)} style={S.input}>
            <option value="">Selecione a obra...</option>
            {OBRAS.map(o => <option key={o.id} value={o.id}>{o.id} – {o.nome}</option>)}
          </select>
        </div>

        <label style={S.label}>Materiais Devolvidos *</label>
        {itens.map((item, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px auto", gap: 10, marginBottom: 10, alignItems: "center" }}>
            <select value={item.matId} onChange={e => updateItem(i, "matId", e.target.value)} style={{ ...S.input }}>
              <option value="">Selecione o material...</option>
              {MATERIAIS.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
            <input type="number" min="1" placeholder="Qtd" value={item.qtd} onChange={e => updateItem(i, "qtd", e.target.value)} style={{ padding: "10px 12px", borderRadius: 8, border: "0.5px solid #E8DDE2", fontSize: 14, color: "#1A0A10" }} />
            {itens.length > 1 && <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9E8590" }}><Trash2 size={16} /></button>}
          </div>
        ))}

        <button onClick={addItem} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "0.5px dashed #D4BBCA", borderRadius: 8, padding: "8px 16px", color: "#7B5A67", fontSize: 13, cursor: "pointer", width: "100%", justifyContent: "center", marginBottom: 24 }}>
          <Plus size={14} /> Adicionar material
        </button>

        <button disabled={!itensValidos} onClick={() => setConcluido(true)} style={{ ...S.btnPrimary(!itensValidos), width: "100%", justifyContent: "center", background: itensValidos ? "#1A6B3A" : "#E8DDE2" }}>
          <Check size={15} /> Confirmar Devolução
        </button>
      </div>
    </div>
  );
}

// ─── Planejamento ─────────────────────────────────────────────────────────────
function Planejamento() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ padding: 28 }}>
      <p style={S.pageTitle}>Planejamento</p>
      <p style={S.pageSub}>Materiais planejados versus utilizados por obra</p>

      {OBRAS.map(obra => {
        const plan = PLANEJAMENTO.find(p => p.obraId === obra.id);
        const isOpen = expanded === obra.id;
        return (
          <div key={obra.id} style={{ ...S.card, marginBottom: 12 }}>
            <button
              onClick={() => setExpanded(isOpen ? null : obra.id)}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: obra.status === "ativo" ? "#FBF0F4" : "#F0FFF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ClipboardList size={18} color={obra.status === "ativo" ? "#8B1A4A" : "#1A6B3A"} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#1A0A10" }}>{obra.id} — {obra.nome}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#9E8590" }}>Encarregado: {obra.encarregado} · Previsão: {obra.prev}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: obra.status === "ativo" ? "#FBF0F4" : "#F0FFF6", color: obra.status === "ativo" ? "#8B1A4A" : "#1A6B3A" }}>
                  {obra.status === "ativo" ? "Em andamento" : "Concluída"}
                </span>
                {isOpen ? <ChevronDown size={16} color="#9E8590" /> : <ChevronRight size={16} color="#9E8590" />}
              </div>
            </button>

            {isOpen && plan && (
              <div style={{ borderTop: "0.5px solid #F0EAED", padding: "0 20px 16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 12 }}>
                  <thead>
                    <tr style={{ background: "#F6F4F2" }}>
                      {["Material", "Unid.", "Planejado", "Utilizado", "Saldo"].map(h => (
                        <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontWeight: 500, color: "#7B5A67", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plan.itens.map((item, i) => {
                      const saldo = item.planejado - item.usado;
                      return (
                        <tr key={i} style={{ borderTop: "0.5px solid #F0EAED" }}>
                          <td style={{ padding: "10px 12px", color: "#1A0A10" }}>{item.mat}</td>
                          <td style={{ padding: "10px 12px", color: "#9E8590" }}>{item.un}</td>
                          <td style={{ padding: "10px 12px", color: "#1A0A10", fontWeight: 500 }}>{item.planejado}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: "#F0EAED", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${Math.min((item.usado / item.planejado) * 100, 100)}%`, background: "#8B1A4A", borderRadius: 3 }} />
                              </div>
                              <span style={{ color: "#1A0A10", fontWeight: 500, minWidth: 24 }}>{item.usado}</span>
                            </div>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: saldo > 0 ? "#B45309" : "#1A6B3A", background: saldo > 0 ? "#FFF7ED" : "#F0FFF6", padding: "2px 8px", borderRadius: 6 }}>
                              {saldo > 0 ? `+${saldo}` : saldo}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Histórico ────────────────────────────────────────────────────────────────
function Historico() {
  const [filter, setFilter] = useState("todos");
  const filtered = HISTORICO.filter(h => filter === "todos" || h.tipo === filter);

  return (
    <div style={{ padding: 28 }}>
      <p style={S.pageTitle}>Histórico</p>
      <p style={S.pageSub}>Todas as movimentações de materiais</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["todos", "Todos"], ["saida", "Saídas"], ["devolucao", "Devoluções"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: filter === val ? 500 : 400, background: filter === val ? "#8B1A4A" : "white", color: filter === val ? "white" : "#7B5A67", border: `0.5px solid ${filter === val ? "#8B1A4A" : "#E8DDE2"}` }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ ...S.card }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F6F4F2" }}>
              {["Data", "Tipo", "Obra", "Encarregado", "Materiais"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#7B5A67", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(mov => (
              <tr key={mov.id} style={{ borderTop: "0.5px solid #F0EAED" }}>
                <td style={{ padding: "12px 16px", color: "#9E8590", whiteSpace: "nowrap" }}>{mov.data}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={S.tag(mov.tipo)}>
                    {mov.tipo === "saida" ? <ArrowUpRight size={11} /> : <ArrowDownLeft size={11} />}
                    {mov.tipo === "saida" ? "Saída" : "Devolução"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <p style={{ fontWeight: 500, color: "#1A0A10", margin: 0 }}>{mov.obra}</p>
                  <p style={{ fontSize: 11, color: "#9E8590", margin: 0 }}>{mov.obraNome}</p>
                </td>
                <td style={{ padding: "12px 16px", color: "#1A0A10", whiteSpace: "nowrap" }}>{mov.encarregado}</td>
                <td style={{ padding: "12px 16px" }}>
                  {mov.itens.map((it, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#1A0A10", marginBottom: 2 }}>
                      {it.mat} <span style={{ color: "#7B5A67" }}>× {it.qtd} {it.un}</span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Painel Geral",        icon: LayoutDashboard },
  { id: "saida",     label: "Registrar Saída",      icon: ArrowUpRight    },
  { id: "devolucao", label: "Registrar Devolução",  icon: ArrowDownLeft   },
  { id: "planejamento", label: "Planejamento",      icon: ClipboardList   },
  { id: "historico", label: "Histórico",            icon: History         },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#F6F4F2", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{ width: 224, background: "#180A10", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "#8B1A4A", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={18} color="white" />
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: 14, margin: 0 }}>AlmoxControl</p>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, margin: 0 }}>Almoxarifado</p>
            </div>
          </div>
        </div>

        <nav style={{ padding: "12px 10px", flex: 1 }}>
          {NAV.map(item => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2, background: active ? "#8B1A4A" : "transparent", color: active ? "white" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: active ? 500 : 400, textAlign: "left" }}>
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#8B1A4A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 600 }}>AM</div>
            <div>
              <p style={{ color: "white", fontSize: 12, margin: 0, fontWeight: 500 }}>Assistente Adm.</p>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, margin: 0 }}>almoxarifado</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        {page === "dashboard"    && <Dashboard />}
        {page === "saida"        && <RegistrarSaida />}
        {page === "devolucao"    && <RegistrarDevolucao />}
        {page === "planejamento" && <Planejamento />}
        {page === "historico"    && <Historico />}
      </main>
    </div>
  );
}
