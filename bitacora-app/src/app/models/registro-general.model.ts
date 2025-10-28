export interface RegistroGeneral {
    // 📘 Generales
    g_fecha: string;
    g_tecnico: string;
    g_cantidadEquipos: number | null;
    g_numeroRemisionEquipos: string | null;
    g_numeroRemisionEquiposSalida: string | null;
    g_liberaRepuestos: boolean;
    g_numeroRemisionRepuestos: string | null;
    g_mostrarAlistamiento: boolean;
    g_mostrarMantenimiento: boolean;
    g_mostrarTercero: boolean;
    g_ayudaOtroTecnico: boolean;
    g_nombreOtroTecnico: string;

    // ⚙️ Alistamiento
    a_alarmaCero?: boolean;
    a_desconexion?: boolean;
    a_flujoMaximo?: boolean;
    a_marcaCalor?: boolean;
    a_cantidadMarcaCalor?: number | null;
    a_i_equiposVerificados?: number | null;
    a_i_horaInicio?: string | null;
    a_i_horaFin?: string | null;
    a_i_equiposApoyo?: number | null;
    a_l_equiposVerificados?: number | null;
    a_l_horaInicio?: string | null;
    a_l_horaFin?: string | null;
    a_l_equiposApoyo?: number | null;
    a_p_equiposVerificados?: number | null;
    a_p_horaInicio?: string | null;
    a_p_horaFin?: string | null;
    a_p_equiposApoyo?: number | null;
    a_li_equiposVerificados?: number | null;
    a_li_horaInicio?: string | null;
    a_li_horaFin?: string | null;
    a_li_equiposApoyo?: number | null;

    // 🔧 Mantenimiento
    m_realizaReparacion?: boolean;
    m_s_equiposVerificados?: number | null;
    m_s_horaInicio?: string | null;
    m_s_horaFin?: string | null;
    m_s_equiposApoyo?: number | null;
    m_i_equiposVerificados?: number | null;
    m_i_horaInicio?: string | null;
    m_i_horaFin?: string | null;
    m_i_equiposApoyo?: number | null;
    m_l_equiposVerificados?: number | null;
    m_l_horaInicio?: string | null;
    m_l_horaFin?: string | null;
    m_l_equiposApoyo?: number | null;
    m_p_equiposVerificados?: number | null;
    m_p_horaInicio?: string | null;
    m_p_horaFin?: string | null;
    m_p_equiposApoyo?: number | null;
    m_r_equiposIngresados?: number | null;
    m_r_equiposReparados?: number | null;
    m_r_horaInicio?: string | null;
    m_r_horaFin?: string | null;
    m_r_equiposApoyo?: number | null;
    m_li_equiposLiberados?: number | null;
    m_li_horaInicio?: string | null;
    m_li_horaFin?: string | null;
    m_li_equiposApoyo?: number | null;
    m_te_equiposVerificados?: number | null;
    m_te_horaInicio?: string | null;
    m_te_horaFin?: string | null;

    // 👷‍♂️ Tercero
    t_s_equiposVerificados?: number | null;
    t_s_horaInicio?: string | null;
    t_s_horaFin?: string | null;
    t_s_equiposApoyo?: number | null;
    t_i_equiposVerificados?: number | null;
    t_i_horaInicio?: string | null;
    t_i_horaFin?: string | null;
    t_i_equiposApoyo?: number | null;
    t_l_equiposVerificados?: number | null;
    t_l_horaInicio?: string | null;
    t_l_horaFin?: string | null;
    t_l_equiposApoyo?: number | null;
    t_p_equiposVerificados?: number | null;
    t_p_horaInicio?: string | null;
    t_p_horaFin?: string | null;
    t_p_equiposApoyo?: number | null;
    t_li_equiposLiberados?: number | null;
    t_li_horaInicio?: string | null;
    t_li_horaFin?: string | null;
    t_li_equiposApoyo?: number | null;
    t_te_equiposVerificados?: number | null;
    t_te_horaInicio?: string | null;
    t_te_horaFin?: string | null;
}

